import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    email: v.string(),
    picture: v.optional(v.string()),
  }).index("by_email", ["email"]),

  designs: defineTable({
    owner_id: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    url: v.string(),
  }).index("by_owner", ["owner_id"]),

  designs_page: defineTable({
    design_id: v.id("designs"),
    url: v.optional(v.string()),
    meta: v.object({
      width: v.number(),
      height: v.number(),
      background: v.string(),
    }),
  }),

  shapes: defineTable({
    design_page_id: v.id("designs_page"),
    shape_id: v.string(),
    props: v.string(),
    // props: v.object({
    //   type: v.string(),
    //   top: v.number(),
    //   left: v.number(),
    //   width: v.number(),
    //   height: v.number(),
    //   fill: v.string(),
    //   stroke: v.string(),
    //   strokeWidth: v.number(),
    //   scaleX: v.number(),
    //   scaleY: v.number(),
    //   angle: v.number(),
    //   flipX: v.boolean(),
    //   flipY: v.boolean(),
    //   opacity: v.number(),
    //   shadow: v.any(),
    //   visible: v.boolean(),
    //   skewX: v.number(),
    //   skewY: v.number(),
    //   path: v.optional(v.array(v.array(v.string()))),
    // }),
  })
    .index("by_designpage", ["design_page_id"])
    .index("by_shape_id", ["shape_id"]),

  //----------------------- //

  workspaces: defineTable({
    owner: v.id("users"),
    title: v.string(),
  }),

  pages: defineTable({
    workspace_id: v.id("workspaces"),
  }),

  shape_object: defineTable({
    page_id: v.id("pages"),
    id: v.string(),
    props: v.string(),
  }),
  page_data: defineTable({
    data: v.string(),
    width: v.number(),
    height: v.number(),
    page_id: v.id("pages"),
  }),
});

// "{\"type\":\"Path\",\"version\":\"6.6.1\",\"originX\":\"left\",\"originY\":\"top\",\"left\":250,\"top\":250,\"width\":18.0121,\"height\":18.0121,\"fill\":\"transparent\",\"stroke\":\"white\",\"strokeWidth\":3,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":true,\"strokeMiterLimit\":4,\"scaleX\":5,\"scaleY\":5,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"path\":[[\"M\",3.293,20.707],[\"C\",2.9026180616671367,20.316500148514187,2.902618061667136,19.683499851485813,3.2929999999999997,19.293],[\"L\",19.293,3.2929999999999993],[\"C\",19.54407447026153,3.0330434155469006,19.915877892142184,2.928787402801667,20.26550732389328,3.0203028434170873],[\"C\",20.61513675564438,3.111818284032508,20.88818171596749,3.384863244355618,20.979697156582912,3.734492676106715],[\"C\",21.071212597198333,4.084122107857812,20.9669565844531,4.455925529738466,20.707,4.706999999999998],[\"L\",4.707000000000001,20.707],[\"C\",4.316500148514186,21.097381938332862,3.683499851485814,21.097381938332862,3.293,20.707],[\"Z\"]]}"
