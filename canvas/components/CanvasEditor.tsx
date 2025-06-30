"use client";
import CanvasC from "@/canvas/canvas";
// import CanvasOptions from "../canvas_options";
// import ZoomContainer from "./zoom_container";
import OptionsMobile from "../options_mobile";
import RightContainer from "./right-container";
// import WhichOContainer from "./which_option_container";

// import { CanvasElements } from "./elements";
import { RefObject, useRef } from "react";
import { useCanvasStore } from "@/canvas/store";
import {
   ContextMenu,
   ContextMenuContent,
   ContextMenuItem,
   ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useEditorContext } from "./editor-wrapper";
import LeftContainer from "./left-container";
import { ZoomPanContainer } from "@/components/zoomable";

type props = {
   canvasC_ref: RefObject<CanvasC | null>;
   canvasRef: RefObject<HTMLCanvasElement | null>;
};

function CanvasEditor({ canvasC_ref, canvasRef }: props) {
   const { isEdit } = useEditorContext();
   const snap = useCanvasStore((state) => state.snapping);
   const setSnap = useCanvasStore((state) => state.setSnap);
   const containerScale = useCanvasStore((state) => state.containerScale);

   const containerRef = useRef<HTMLDivElement | null>(null);
   const innerContainerRef = useRef<HTMLDivElement | null>(null);

   return (
      <div className="w-full h-full flex">
         <div className="w-fit h-full shrink-0">{isEdit && <LeftContainer />}</div>

         <div className={`relative w-full h-full flex flex-col items-center`}>
            <ZoomPanContainer>
               {/* {canvas container} */}
               {isEdit ? (
                  <>
                     <div className="w-full h-full flex justify-center items-center overflow-auto">
                        <div
                           ref={containerRef}
                           style={{
                              scale: containerScale,
                           }}
                           className="shrink-0 w-full h-full flex justify-center items-center relative"
                        >
                           <div
                              ref={innerContainerRef}
                              className="absolute flex justify-center items-center"
                           >
                              <ContextMenu>
                                 <ContextMenuTrigger className="w-full h-full" asChild>
                                    <canvas
                                       ref={canvasRef}
                                       className={`shrink-0 border border-foreground/10 rounded-md shadow-lg`}
                                    />
                                 </ContextMenuTrigger>
                                 <ContextMenuContent>
                                    <ContextMenuItem
                                       onClick={() => {
                                          if (!canvasC_ref.current) return;
                                          canvasC_ref.current.snapping =
                                             !canvasC_ref.current.snapping;
                                          setSnap(canvasC_ref.current.snapping);
                                       }}
                                    >
                                       {snap ? "Disable " : "Enable "}
                                       snapping
                                    </ContextMenuItem>
                                 </ContextMenuContent>
                              </ContextMenu>
                           </div>
                        </div>
                     </div>
                  </>
               ) : (
                  <canvas
                     ref={canvasRef}
                     className={`shrink-0 border border-foreground/10 rounded-md shadow-lg`}
                  ></canvas>
               )}
            </ZoomPanContainer>
         </div>

         {isEdit && (
            // <div className="w-full border-t border-t-foreground/50 z-50 min-h-14 flex items-center px-5">
            <div className="fixed bottom-2 md:bottom-4 left-0 w-full flex justify-center">
               <div className="border-1 w-fit shadow-lg rounded-xl bg-background p-2">
                  <OptionsMobile />
               </div>
            </div>
         )}

         {/* {right container} */}
         <div className="w-fit hidden xl:block h-full shrink-0">
            {isEdit && (
               <>
                  <RightContainer />
               </>
            )}
         </div>
      </div>
   );
}

export default CanvasEditor;
