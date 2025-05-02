import CollapceWithBtn from "@/components/collapseWithBtn";

import { cn } from "@/lib/utils";
import { FabricObject } from "fabric";
import { EyeClosed, EyeIcon, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useCanvasStore } from "../store";
import { useEditorContext } from "./editor-wrapper";

export default function LeftContainer() {
   const { showUploads, handleSideToggle, sidesOpen, canvas } = useEditorContext();
   const activeObject = useCanvasStore((state) => state.activeObject);
   const [objs, setObjs] = useState<FabricObject[] | []>(() => {
      return canvas?.current?.canvas?.getObjects() || [];
   });

   const handleActive = (o: FabricObject) => {
      if (!canvas.current) return;
      canvas.current.canvas.discardActiveObject();
      canvas.current.canvas.setActiveObject(o);
      canvas.current.canvas.requestRenderAll();
   };

   const handleVisible = (o: FabricObject) => {
      if (!canvas.current) return;
      const isV = o.get("visible");
      canvas.current.changeCanvasProperties(o, {
         visible: isV ? false : true,
      });
      if (isV) {
         canvas.current.canvas.discardActiveObject();
      } else {
         canvas.current.canvas.discardActiveObject();
         canvas.current.canvas.setActiveObject(o);
      }
   };

   useEffect(() => {
      setObjs(() => {
         return canvas?.current?.canvas?.getObjects() || [];
      });
   }, [activeObject, canvas]);

   return (
      <>
         {!sidesOpen ? (
            <div className="fixed z-50 top-4 left-5 p-2 rounded-sm bg-muted border border-muted-foreground/40 shadow-md">
               <PanelRightOpen onClick={() => handleSideToggle(true)} />
            </div>
         ) : (
            <div className="w-[350px] h-full border-r-2 border-r-muted bg-muted py-4">
               <div className="w-full flex justify-between px-3">
                  <span>something</span> <PanelRightClose onClick={() => handleSideToggle(false)} />
               </div>

               <CollapceWithBtn label="Layers" classname="px-3 text-sm">
                  {objs.map((o, i) => (
                     <div
                        key={i}
                        className={cn(
                           activeObject?.get("id") === o.get("id") && "bg-foreground/20",
                           "w-full rounded-l-md py-1 text-xs flex items-center justify-between px-4",
                        )}
                     >
                        <button
                           disabled={!activeObject?.get("visible")}
                           onClick={() => {
                              handleActive(o);
                           }}
                           className="w-full text-start"
                        >
                           {o?.get("type")}
                        </button>
                        <button onClick={() => handleVisible(o)}>
                           {o.get("visible") ? (
                              <EyeIcon width={20} height={20} />
                           ) : (
                              <EyeClosed width={20} height={20} />
                           )}
                        </button>
                     </div>
                  ))}
               </CollapceWithBtn>

               {showUploads && (
                  <CollapceWithBtn label="Assets" classname="px-3">
                     <div className="px-3">Images</div>
                  </CollapceWithBtn>
               )}
            </div>
         )}
      </>
   );
}
