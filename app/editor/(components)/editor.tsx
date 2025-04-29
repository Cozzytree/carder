"use client";

import EditorWrapper from "@/canvas/components/editor-wrapper";

import type { Design, Shapes } from "@/api_/types";
import { useCreateShape, useDeleteShape, useUpdateShape } from "@/api_/mutations/shape-mutation";

type props = {
   design: Design;
   shapes: Shapes[] | [];
};

const Editor = ({ design, shapes }: props) => {
   const { createShape, isCreating } = useCreateShape();
   const { isUpdating, updateShape } = useUpdateShape();
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
            onChange={(e, action) => {
               if (e.type === "activeselection" || e.type === "group") return;
               const id = e.get("id");
               if (!id) return;

               if (action === "create") {
                  const shape = JSON.stringify(e.toJSON());
                  handleCreateShape([{ id, props: shape }]);
               } else if (action === "update") {
                  const shape = JSON.stringify(e.toJSON());
                  handleUpdateShape([{ id, props: shape }]);
               } else if (action === "delete") {
                  handleDeleteShape([id]);
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
