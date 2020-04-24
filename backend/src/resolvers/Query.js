const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");
const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(parent, args, ctx, info) {
    //check if there is a current userId
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info,
    );
  },
  async users(parent, args, ctx, info) {
    //  1) check if they are logged in
    if (!ctx.request.userId) {
      throw new Error(`You must be logged in`);
    }
    //  2) check if user has permission to query all users
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);
    //  3) query all users
    return ctx.db.query.users({}, info);
  },
  async order(parent, args, ctx, info) {
    //1. make sure they are logged in
    if (!ctx.request.userId) {
      throw new Error("You are not logged in");
    }
    //2. query current order
    const order = await ctx.db.query.order(
      {
        where: { id: args.id },
      },
      info,
    );
    //3. check permissions for order
    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes(
      "ADMIN",
    );
    if (!ownsOrder || !hasPermissionToSeeOrder) {
      throw new Error("You cant see this buddd");
    }
    //4. return order
    return order;
  },
};

module.exports = Query;
