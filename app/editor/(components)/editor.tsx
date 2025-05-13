"use client";

import EditorWrapper from "@/canvas/components/editor-wrapper";

import type { Design, Shapes } from "@/api_/types";
import { useCreateShape, useDeleteShape, useUpdateShape } from "@/api_/mutations/shape-mutation";
import { ActiveSelection } from "fabric";
import { useUpdateDesign } from "@/api_/mutations/design-mutation";

type props = {
   design: Design;
   shapes: Shapes[] | [];
};

const Editor = ({ design, shapes }: props) => {
   const { createShape, isCreating } = useCreateShape();
   const { updateShape } = useUpdateShape();
   const { isUpdatingDesign, updateDesign } = useUpdateDesign();
   const { deleteShape } = useDeleteShape();

   const handleCreateShape = (shapes: { id: string; props: string }[]) => {
      createShape({
         id: design?.id,
         data: shapes,
      });
   };

   const handleUpdateShape = (shapes: { id: string; props: string }[]) => {
      updateShape({
         data: shapes,
      });
   };

   const handleDeleteShape = (shapes: string[]) => {
      deleteShape({ data: shapes });
   };

   return (
      <div className="w-full h-full flex flex-1">
         <EditorWrapper
            showUploads={true}
            onChange={({ action, params: e, props }) => {
               console.log(action);
               if (action === "create") {
                  const newShapes: { id: string; props: string }[] = [];
                  if (e instanceof ActiveSelection) {
                  } else {
                     const id = e?.get("id");
                     if (id) newShapes.push({ id, props: JSON.stringify(e?.toJSON()) });
                  }
                  handleCreateShape(newShapes);
               } else if (action === "update") {
                  const updateShapes: { id: string; props: string }[] = [];
                  if (e instanceof ActiveSelection) {
                     e.forEachObject((o) => {
                        const id = o.get("id");
                        // Get absolute coordinates
                        const absCoords = o.getBoundingRect();

                        const json = o.toJSON();
                        json.top = absCoords.top;
                        json.left = absCoords.left;

                        updateShapes.push({ id, props: JSON.stringify(json) });
                     });
                  } else {
                     const id = e?.get("id");
                     if (id) updateShapes.push({ id, props: JSON.stringify(e?.toJSON()) });
                  }
                  handleUpdateShape(updateShapes);
               } else if (action === "delete") {
                  const ids: string[] = [];
                  if (e instanceof ActiveSelection) {
                     e.forEachObject((o) => {
                        const id = o.get("id");
                        if (id) {
                           ids.push(id);
                        }
                     });
                  } else {
                     const id = e?.get("id");
                     if (id) ids.push(id);
                  }
                  handleDeleteShape(ids);
               } else if (action === "canvas-props" && props !== undefined) {
                  updateDesign({ id: design.id, props });
               }
            }}
            initialData={{
               shapes,
               height: design?.height,
               width: design?.width,
            }}
         />
      </div>
   );
};
export default Editor;
