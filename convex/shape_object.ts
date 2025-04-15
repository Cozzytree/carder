import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const getShapeObjects = query({
  args: { page_id: v.id("pages") },
  handler: async (ctx, { page_id }) => {
    return await ctx.db
      .query("shape_object")
      .filter((q) => q.eq(q.field("page_id"), page_id))
      .collect();
  },
});

const createObjectShape = mutation({
  args: {
    objs: v.array(
      v.object({ id: v.string(), page_id: v.id("pages"), props: v.string() }),
    ),
  },
  handler: async (ctx, { objs }) => {
    try {
      const insertPromises = objs.map((obj) =>
        ctx.db.insert("shape_object", {
          id: obj.id,
          page_id: obj.page_id,
          props: obj.props,
        }),
      );

      // Wait for all insertions to complete
      await Promise.all(insertPromises);

      return "success"; // Return a success message after all insertions are done
    } catch (error) {
      // Catch any errors and provide a meaningful message
      if (error instanceof Error)
        throw new Error(`Failed to insert shapes: ${error.message}`);
    }
  },
});

const updateObjectShape = mutation({
  args: {
    objs: v.array(v.object({ id: v.id("shape_object"), props: v.string() })),
  },
  handler: async (ctx, { objs }) => {
    try {
      const objToUpdate = objs.map((o) => {
        return ctx.db.patch(o.id, { props: o.props });
      });

      Promise.all(objToUpdate);
      return "success";
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  },
});

const deleteObjectShape = mutation({
  args: { objIds: v.array(v.id("shape_object")) },
  handler: async (ctx, { objIds }) => {
    try {
      const deletes = objIds.map((o) => {
        return ctx.db.delete(o);
      });
      Promise.allSettled(deletes);

      return "success";
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  },
});

export {
  deleteObjectShape,
  getShapeObjects,
  createObjectShape,
  updateObjectShape,
};
