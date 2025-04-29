"use client";
import EditorWrapper from "@/app/workspace/[workspace_id]/canvas/components/editor-wrapper";
import QueueStore from "@/lib/queueShapes";

import type { Id } from "@/convex/_generated/dataModel";
import type { DBshape, Design_Page } from "@/lib/types";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect, useRef } from "react";
import { FabricImage, FabricObject } from "fabric";

type props = {
   page_id: Id<"designs_page">;
   shapes: DBshape[];
   design_page: Design_Page;
};

function EditorContainer({ page_id, shapes, design_page }: props) {
   const queueShapeStore = useRef<QueueStore | null>(null);
   const newShape = useMutation(api.shapes.createNewShape);
   const updateShape = useMutation(api.shapes.updateShape);
   const updateDesign = useMutation(api.designs.updateDesign);
   const deleteShape = useMutation(api.shapes.deleteShape);
   const uploadUrl = useMutation(api.upload.genUploadUrl);

   const handleUpload = async (data: string) => {
      const url = await uploadUrl();

      const res = await fetch(url, {
         method: "POST",
         body: data,
      });
   };

   useEffect(() => {
      if (!queueShapeStore.current) {
         queueShapeStore.current = new QueueStore(); // Initialize if null
      }

      const timerId = setInterval(() => {
         if (!queueShapeStore.current) return;
         const s = queueShapeStore.current.popShapes();
         if (s?.length) {
            s.forEach((shape) => {
               if (shape.action == "create") {
                  if (shape.type === "Image" || shape.type === "image") {
                  } else {
                     newShape({
                        design_page_id: shape.page_id as Id<"designs_page">,
                        props: shape.props,
                        shape_id: shape.shapeId,
                     }).then((r) => {
                        if (r === "success") {
                        }
                     });
                  }
               } else if (shape.action == "update") {
                  if (shape.shapeId) {
                     updateShape({
                        newVal: shape.props,
                        shape_id: shape.shapeId,
                     });
                  }
               } else if (shape.action == "resize") {
                  const props = shape.props.split("-");
                  const w = Number(props[0]);
                  const h = Number(props[1]);
                  const back = props[2];
                  if (!isNaN(w) && !isNaN(h)) {
                     updateDesign({
                        background: back,
                        design_page_id: page_id,
                        height: h,
                        width: w,
                     });
                  }
               } else if (shape.action == "delete") {
                  deleteShape({
                     shape_id: shape.shapeId,
                  });
               }
            });
         }
      }, 5000);

      return () => clearInterval(timerId);
   }, []);

   return (
      <div className="w-full border-l border-foreground/50 overflow-hidden h-screen flex flex-col">
         <EditorWrapper
            initialData={{
               height: design_page.meta.height,
               width: design_page.meta.width,
               shapes,
            }}
            idPrefix={page_id}
            onChange={async (e, action) => {
               if (!queueShapeStore.current) return;
               if (e instanceof FabricObject && action !== "resize") {
                  if (e instanceof FabricImage) {
                     const url = e.getSrc();
                     if (url.startsWith("http")) {
                     } else {
                        await handleUpload(url);
                     }
                  }

                  queueShapeStore.current.addNewShapes([
                     {
                        action,
                        page_id,
                        props: JSON.stringify(e.toJSON()),
                        shapeId: e.get("id"),
                        type: e.type,
                     },
                  ]);
               } else {
                  queueShapeStore.current.addNewShapes([
                     {
                        action,
                        page_id,
                        props: `${e.width}-${e.height}-${e.background}`,
                        shapeId: "",
                        type: "",
                     },
                  ]);
               }
            }}
         >
            <SidebarTrigger />
         </EditorWrapper>
      </div>
   );
}

export default EditorContainer;
