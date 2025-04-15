import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

const getPageData = query({
  args: { id: v.id("pages") },
  handler: async (ctx, { id }) => {
    const d = await ctx.db
      .query("page_data")
      .filter((q) => q.eq(q.field("page_id"), id))
      .first();

    if (d?.data.length) {
      const url = await ctx.storage.getUrl(d.data as Id<"_storage">);
      if (url) {
        d.data = url;
      }
    }
    return d;
  },
});

const createPageData = mutation({
  args: {
    page_id: v.id("pages"),
    data: v.string(),
    width: v.number(),
    height: v.number(),
  },
  handler: async (ctx, { data, height, page_id, width }) => {
    const datainsertId = await ctx.db.insert("page_data", {
      data,
      height,
      page_id,
      width,
    });
    if (!datainsertId) throw new Error("error while saving data");
    return datainsertId;
  },
});

const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

const updatePageData = mutation({
  args: {
    id: v.id("page_data"),
    data: v.string(),
    width: v.number(),
    height: v.number(),
    old_id: v.string(),
  },
  handler: async (ctx, { id, data, height, width, old_id }) => {
    const page = await ctx.db.get(id);
    if (!page) return { message: "page not found" };

    if (page.data) {
      await ctx.storage.delete(page.data as Id<"_storage">);
    }

    return await ctx.db.patch(id, { data, height, width });
  },
});

export { createPageData, getPageData, updatePageData, generateUploadUrl };
