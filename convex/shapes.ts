import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const getShapes = query({
  args: { design_page_id: v.id("designs_page") },
  handler: async (ctx, { design_page_id }) => {
    return await ctx.db
      .query("shapes")
      .withIndex("by_designpage", (q) => q.eq("design_page_id", design_page_id))
      .collect();
  },
});

const createNewShape = mutation({
  args: {
    design_page_id: v.id("designs_page"),
    props: v.string(),
    shape_id: v.string(),
  },
  handler: async (ctx, props) => {
    const res = await ctx.db.insert("shapes", props);
    if (!res) return null;
    return "success";
  },
});

const deleteShape = mutation({
  args: { shape_id: v.string() },
  handler: async (ctx, { shape_id }) => {
    const shape = await ctx.db
      .query("shapes")
      .filter((q) => q.eq(q.field("shape_id"), shape_id))
      .first();

    if (!shape) return null;

    await ctx.db.delete(shape._id);
    return "success";
  },
});

const updateShape = mutation({
  args: { shape_id: v.string(), newVal: v.string() },
  handler: async (ctx, { shape_id, newVal }) => {
    const shape = await ctx.db
      .query("shapes")
      .filter((q) => q.eq(q.field("shape_id"), shape_id))
      .first();

    if (!shape) return null;
    await ctx.db.patch(shape._id, { props: newVal });
    return "success";
  },
});

export { updateShape, createNewShape, deleteShape, getShapes };
