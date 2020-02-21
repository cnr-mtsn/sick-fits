const Mutations = {
  async createItem(parent, args, ctx, info) {
    //TODO: check if logged in
    const item = await ctx.db.mutation.createItem(
      {
        data: {
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
    //2. check if own item, have permissions
    //3. delete item
    return ctx.db.mutation.deleteItem({ where, info });
  },
};

module.exports = Mutations;
