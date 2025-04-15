import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const getWorkspacePages = query({
  args: { workspace_id: v.string() },
  handler: async (ctx, { workspace_id }) => {
    return await ctx.db
      .query("pages")
      .filter((q) => q.eq(q.field("workspace_id"), workspace_id))
      .collect();
  },
});

const getFirstPage = query({
  args: { workspace_id: v.string() },
  handler: async (ctx, { workspace_id }) => {
    const page = ctx.db
      .query("pages")
      .filter((q) => q.eq(q.field("workspace_id"), workspace_id))
      .first();
    return page;
  },
});

const createNewPage = mutation({
  args: {
    authId: v.string(),
    workspace_id: v.id("workspaces"),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
  },
  handler: async (ctx, { workspace_id, authId, width, height }) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq("authId", authId))
      .first();
    if (!user) throw new Error("user not found");

    const workspace = await ctx.db.get(workspace_id);
    if (!workspace) throw new Error("no workspace found");

    const created_page = await ctx.db.insert("pages", { workspace_id });
    if (!created_page) throw new Error("error while creating page");

    const page_data = await ctx.db.insert("page_data", {
      data: "",
      width: width || 600,
      height: height || 600,
      page_id: created_page,
    });

    return { page_data, created_page };
  },
});

const deletePage = mutation({
  args: {
    authId: v.string(),
    workspace_id: v.id("workspaces"),
    page_id: v.id("pages"),
    page_data_id: v.id("page_data"),
  },
  handler: async (ctx, { authId, page_id, workspace_id, page_data_id }) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq("authId", authId))
      .first();
    if (!user) throw new Error("user not found");

    const workspace = await ctx.db.get(workspace_id);
    if (!workspace) throw new Error("no workspace found");
    if (workspace.owner !== user._id) throw new Error("unauthorized action");

    await ctx.db.delete(page_data_id);
    await ctx.db.delete(page_id);

    return "successfully deleted";
  },
});

export { getWorkspacePages, deletePage, createNewPage, getFirstPage };
