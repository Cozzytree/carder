import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const createUser = mutation({
  args: {
    username: v.string(),
    email: v.string(),
    picture: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    if (user) {
      return user;
    }
    const cu = await ctx.db.insert("users", args);
    return await ctx.db.get(cu);
  },
});

const getUser = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .first();
  },
});

export { getUser, createUser };
