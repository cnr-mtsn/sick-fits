const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { hasPermission } = require("../utils");
const stripe = require("../stripe");

const { transport, makeNiceEmail } = require("../mail");

const Mutations = {
  async createItem(parent, args, ctx, info) {
    //TODO: check if logged in
    if (!ctx.request.userId) {
      throw new Error(`You must be logged in to do that!`);
    }
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          user: {
            connect: {
              id: ctx.request.userId,
            },
          },
          ...args,
        },
      },
      info,
    );

    return item;
  },

  updateItem(parent, args, ctx, info) {
    //take a copy of updates
    const updates = { ...args };
    //remove id from updates
    delete updates.id;
    //run update method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info,
    );
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    //1. find item
    const item = await ctx.db.query.item({ where }, `{id, title, user {id}}`);
    //2. Check if user owns item or has permissions to delete items
    const ownsItem = item.user.id === ctx.request.userId; // true or false
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ["ADMIN", "ITEM_DELETE"].includes(permission),
    );
    if (!ownsItem && hasPermissions) {
      throw new Error(`You don't have permissiom to do that`);
    }
    //3. delete item
    return ctx.db.mutation.deleteItem({ where, info });
  },

  async signup(parent, args, ctx, info) {
    //Lowercase emai
    args.email = args.email.toLowerCase();
    //Hash password with bcrypt
    const password = await bcrypt.hash(args.password, 10);
    //create user in db
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] },
        },
      },
      info,
    );
    //CREATE JWT FOR USER
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    //set jwt as cookie on response
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, //1 year cookie
    });
    //finallly return user to browser
    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    //check if ther is a user with that email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    //check if password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error(`Invalid Password!`);
    }

    //generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    //set cookie with token
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return {
      message: "Goodbye!",
    };
  },
  async requestReset(parent, args, ctx, info) {
    //check if real user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No user found for email ${args.email}`);
    }
    //set reste token and expiry on that user
    const randomBytesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; //1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry },
    });
    //email reset token
    const mailRes = await transport.sendMail({
      from: "cnr.mtsn@gmail.com",
      to: user.email,
      subject: "Your password reset code",
      html: makeNiceEmail(
        `Your Code is Here! \n\n <a href="${
          process.env.FRONTEND_URL
        }/reset?resetToken=${resetToken}">Click Here to Reset</a>`,
      ),
    });

    return { message: "Thanks!" };
    //email the reset token
  },
  async resetPassword(parent, args, ctx, info) {
    //1. check if passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error("Yo Passwords Don't Match!");
    }
    //2. check if legit reset token
    //3. check if token expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      },
    });
    if (!user) {
      throw new Error(`This token is either invalid or expired`);
    }
    //hash new password
    const password = await bcrypt.hash(args.password, 10);
    //save new password to user
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    //remove old reset token fields
    //generate jwt
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    //set jwt cookie
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    //return new user
    return updatedUser;
    //have a drink
  },
  async updatePermissions(parent, args, ctx, info) {
    //1. check if logged in
    if (!ctx.request.userId) {
      throw new Error(`You must be logged in`);
    }
    //2. query current user
    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId,
        },
      },
      info,
    );
    //3. check permissions
    hasPermission(currentUser, ["ADMIN", "PERMISSIONUPDATE"]);
    //4. update permissions
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions,
          },
        },
        where: {
          id: args.userId,
        },
      },
      info,
    );
  },
  async addToCart(parent, args, ctx, info) {
    //1. make sure they're signed in
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error(`you must be signed in`);
    }
    //2. query users current cart
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id },
      },
      info,
    });
    //3. check if item is already in cart, increment if it is
    if (existingCartItem) {
      console.log("already in cart");
      return ctx.db.mutation.updateCartItem({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + 1,
        },
      });
    }
    //4. if not in cart, create fresh CartItem for that user
    return ctx.db.mutation.createCartItem({
      data: {
        user: {
          connect: { id: userId },
        },
        item: {
          connect: { id: args.id },
        },
      },
    });
  },
  async removeFromCart(parent, args, ctx, info) {
    //1. Find cart item
    const cartItem = await ctx.db.query.cartItem(
      {
        where: {
          id: args.id,
        },
      },
      `{id, user {id}}`,
    );
    //1.5 Make sure we found an item
    if (!cartItem) throw new Error("No Cart Item Found!");
    //2. make sure they own the item
    if (cartItem.user.id !== ctx.request.userId) {
      throw new Error("Cheatin huhhhh");
    }
    //3. delete the cart item
    return ctx.db.mutation.deleteCartItem(
      {
        where: { id: args.id },
      },
      info,
    );
  },
  async createOrder(parent, args, ctx, info) {
    // 1. query current user & make sure they're signed in
    const { userId } = ctx.request;
    if (!userId)
      throw new Error(`You must be logged in to complete this order!`);
    const user = await ctx.db.query.user(
      {
        where: { id: userId },
      },
      `{
      id
      name
      email
      cart {
        id
        quantity
        item {
          title
          price
          id
          description
          image
          largeImage
        }
      }
    }`,
    );
    // 2. recalculate total for the price
    const amount = user.cart.reduce(
      (tally, cartItem) => tally + cartItem.item.price * cartItem.quantity,
      0,
    );
    console.log(`charging ${amount}`);
    // 3. create stripe charge
    const charge = await stripe.charges.create({
      amount,
      currency: "USD",
      source: args.token,
    });
    // 4. convert cartItems to orderItems
    const orderItems = user.cart.map(cartItem => {
      const orderItem = {
        ...cartItem.item,
        quantity: cartItem.quantity,
        user: { connect: { id: userId } },
      };
      delete orderItem.id;
      return orderItem;
    });
    // 5. create order
    const order = await ctx.db.mutation
      .createOrder({
        data: {
          total: charge.amount,
          charge: charge.id,
          items: { create: orderItems },
          user: { connect: { id: userId } },
        },
      })
      .catch(err => Error(`Something went wrong`));
    // 6. clean up - clear user's cart
    // 7. delete cart Items
    const cartItemIds = user.cart.map(cartItem => cartItem.id);
    await ctx.db.mutation.deleteManyCartItems({
      where: {
        id_in: cartItemIds,
      },
    });
    // 8. return order to client
    return order;
  },
};

module.exports = Mutations;
