/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as canvas_pages from "../canvas_pages.js";
import type * as designs from "../designs.js";
import type * as page_data from "../page_data.js";
import type * as shape_object from "../shape_object.js";
import type * as shapes from "../shapes.js";
import type * as upload from "../upload.js";
import type * as users from "../users.js";
import type * as workspace from "../workspace.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  canvas_pages: typeof canvas_pages;
  designs: typeof designs;
  page_data: typeof page_data;
  shape_object: typeof shape_object;
  shapes: typeof shapes;
  upload: typeof upload;
  users: typeof users;
  workspace: typeof workspace;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
