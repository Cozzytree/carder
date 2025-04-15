import { Id } from "@/convex/_generated/dataModel";

export interface User {
   _id: Id<"users">;
   _creationTime: number;
   picture?: string | undefined;
   username: string;
   email: string;
   avatar?: string;
}

export interface Design_Page {
   _id: Id<"designs_page">;
   _creationTime: number;
   url?: string | undefined;
   design_id: Id<"designs">;
   meta: {
      width: number;
      height: number;
      background: string;
   };
}

export interface Page_data {
   _id: Id<"page_data">;
   data: string;
   height: number;
   width: number;
   page_id: Id<"pages">;
}

export interface DBshape {
   _creationTime: number;
   _id: string;
   design_page_id: string;
   props: string;
   shape_id: string;
}
