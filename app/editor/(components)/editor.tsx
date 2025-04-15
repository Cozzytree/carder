"use client";

import type { Design } from "@/api_/types";
import EditorWrapper from "@/canvas/components/editor-wrapper";

type props = {
   design: Design;
};

const Editor = ({ design }: props) => {
   return (
      <div className="w-full h-full flex flex-1">
         <EditorWrapper
            onChange={() => {}}
            initialData={{
               shapes: [],
               height: design?.height,
               width: design?.width,
            }}
         />
      </div>
   );
};
export default Editor;
