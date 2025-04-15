import { mutation } from "./_generated/server";

const genUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export { genUploadUrl };
