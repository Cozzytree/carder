import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const createNewWorkspace = mutation({
  args: {
    email: v.string(),
    title: v.string(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const foundUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!foundUser) throw new Error("user not found");
    const workspace = await ctx.db.insert("workspaces", {
      title: args.title,
      owner: foundUser._id,
    });
    if (!workspace) throw new Error("error while creating workspace");

    const page = await ctx.db.insert("pages", { workspace_id: workspace });
    await ctx.db.insert("page_data", {
      data: "",
      height: args.height || 600,
      width: args.width || 600,
      page_id: page,
    });

    return { workspace, page };
  },
});

const getUserWorkspaces = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const foundUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    if (!foundUser) throw new Error("user not found");

    const workspaces = await ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("owner"), foundUser._id))
      .collect();

    return workspaces;
  },
});

export { createNewWorkspace, getUserWorkspaces };
