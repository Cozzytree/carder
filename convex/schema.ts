import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    email: v.string(),
    picture: v.optional(v.string()),
    authId: v.string(),
    provider: v.string(),
  }),
  workspaces: defineTable({
    owner: v.id("users"),
    title: v.string(),
  }),
  pages: defineTable({
    page_no: v.number(),
    workspace_id: v.id("workspaces"),
  }),
  page_data: defineTable({
    data: v.string(),
    page_id: v.id("pages"),
  }),
});
