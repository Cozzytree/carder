import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createUser = mutation({
  args: {
    username: v.string(),
    email: v.string(),
    picture: v.optional(v.string()),
    authId: v.string(),
    provider: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq("authId", args.authId))
      .first();
    if (user) {
      throw new Error("user already exists");
    }
    const cu = await ctx.db.insert("users", args);
    return cu;
  },
});
