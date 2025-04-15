import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const getDesigns = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) throw new Error("user not found");
    const designs = await ctx.db
      .query("designs")
      .withIndex("by_owner", (q) => q.eq("owner_id", user._id))
      .collect();

    return designs;
  },
});

const createDesign = mutation({
  args: {
    owner_id: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    url: v.string(),
  },
  handler: async (ctx, props) => {
    const design = await ctx.db.insert("designs", props);
    if (!design) throw new Error("error while creating design");
    return design;
  },
});

const createDesignPage = mutation({
  args: {
    design_id: v.id("designs"),
    meta: v.object({
      width: v.number(),
      height: v.number(),
      background: v.string(),
    }),
  },
  handler: async (ctx, props) => {
    const design_page = await ctx.db.insert("designs_page", props);
    if (!design_page) throw new Error("error while creating page");
    return design_page;
  },
});

const getDesignPages = query({
  args: { design_id: v.id("designs") },
  handler: async (ctx, { design_id }) => {
    const design_pages = (
      await ctx.db
        .query("designs_page")
        .filter((q) => q.eq(q.field("design_id"), design_id))
        .collect()
    ).sort((a, b) => (a._creationTime < b._creationTime ? 1 : 0));
    return design_pages;
  },
});

const getAdesign = query({
  args: { design_id: v.id("designs_page") },
  handler: async (ctx, { design_id }) => {
    const d = await ctx.db.get(design_id);
    return d;
  },
});

const updateDesign = mutation({
  args: {
    design_page_id: v.id("designs_page"),
    width: v.number(),
    height: v.number(),
    background: v.string(),
  },
  handler: async (ctx, { design_page_id, width, height, background }) => {
    await ctx.db.patch(design_page_id, { meta: { background, height, width } });
    return "success";
  },
});
export {
  updateDesign,
  getAdesign,
  getDesigns,
  createDesign,
  createDesignPage,
  getDesignPages,
};
