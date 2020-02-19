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
};

module.exports = Mutations;
