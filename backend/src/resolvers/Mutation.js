const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");

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
    const item = await ctx.db.query.item({ where }, `{id, title}`);
    //2. TODO CHECK PERMISSIONS
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
        `Your Code is Here! \n\n <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset</a>`,
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
};

module.exports = Mutations;
