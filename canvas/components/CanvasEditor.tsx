"use client";
import CanvasC from "@/canvas/canvas";
// import CanvasOptions from "../canvas_options";
// import ZoomContainer from "./zoom_container";
import OptionsMobile from "../options_mobile";
import RightContainer from "./right-container";
// import WhichOContainer from "./which_option_container";

// import { CanvasElements } from "./elements";
import { useIsMobile } from "../hooks/isMobile";
import { RefObject, useEffect, useRef, useState } from "react";
import { useCanvasStore } from "@/canvas/store";
import {
   ContextMenu,
   ContextMenuContent,
   ContextMenuItem,
   ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useEditorContext } from "./editor-wrapper";
import LeftContainer from "./left-container";

type props = {
   canvasC_ref: RefObject<CanvasC | null>;
   canvasRef: RefObject<HTMLCanvasElement | null>;
};

function CanvasEditor({ canvasC_ref, canvasRef }: props) {
   const { isEdit } = useEditorContext();
   const width = useCanvasStore((state) => state.width);
   const height = useCanvasStore((state) => state.height);
   const snap = useCanvasStore((state) => state.snapping);
   const setSnap = useCanvasStore((state) => state.setSnap);
   const containerScale = useCanvasStore((state) => state.containerScale);

   // const { which } = useWhichOptionsOpen();
   const { isMobile } = useIsMobile();
   const [containerZoom, setContainerZoom] = useState(1);
   const containerRef = useRef<HTMLDivElement | null>(null);
   const innerContainerRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      const handler = () => {
         if (!canvasRef.current || !isEdit) return;
         if (innerContainerRef.current) {
            innerContainerRef.current.scrollIntoView({
               behavior: "smooth",
               block: "center",
               inline: "center",
            });
         }
      };
      handler();
   }, [containerZoom, canvasRef, isEdit]);

   return (
      <div className="w-full h-full flex">
         {/* {left sidebar} */}
         {/* {isEdit && (
            <div
               className={`h-full border-r border-r-foreground/50 ${isMobile ? "hidden" : "flex"}`}
            >
               <div className="h-full flex flex-col items-center border">
                  <CanvasElements canvasC={canvasC_ref} />
               </div>
               {which !== null && !isMobile && (
                  <div className="h-full z-50 border-l border-l-foreground/50">
                     <WhichOContainer canvasC={canvasC_ref} />
                  </div>
               )}
            </div>
         )} */}
         {isEdit && !isMobile && <LeftContainer />}

         <div className="relative w-full h-full flex flex-col items-center">
            {/* {isEdit && (
               <div>
                  <CanvasOptions
                     containerZoom={containerZoom}
                     setContainerZoom={setContainerZoom}
                     canvasC={canvasC_ref}
                     containerRef={containerRef}
                  />
               </div>
            )} */}

            {/* {canvas container} */}
            {isEdit ? (
               <div className="w-full h-full flex justify-center overflow-auto">
                  <div
                     ref={containerRef}
                     style={{
                        scale: containerScale,
                     }}
                     className="shrink-0 w-full flex justify-center items-center py-5 h-full relative"
                  >
                     <div
                        ref={innerContainerRef}
                        className="absolute top-0 left-0 flex justify-center items-center"
                        style={{
                           width:
                              containerZoom < 1.5 && containerZoom >= 0.25
                                 ? "100%"
                                 : `${width + containerZoom * 500 + "px"}`,
                           height: `${height + containerZoom * 250 + "px"}`,
                        }}
                     >
                        <ContextMenu>
                           <ContextMenuTrigger asChild>
                              <canvas
                                 ref={canvasRef}
                                 className={`shrink-0 border border-foreground/10 rounded-md shadow-lg`}
                              />
                           </ContextMenuTrigger>
                           <ContextMenuContent>
                              <ContextMenuItem
                                 onClick={() => {
                                    if (!canvasC_ref.current) return;
                                    canvasC_ref.current.snapping = canvasC_ref.current.snapping
                                       ? false
                                       : true;
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
            ) : (
               <canvas
                  ref={canvasRef}
                  className={`shrink-0 border border-foreground/10 rounded-md shadow-lg`}
               ></canvas>
            )}

            {isEdit && (
               // <div className="w-full border-t border-t-foreground/50 z-50 min-h-14 flex items-center px-5">
               <div className="absolute bottom-8 left-0 w-full flex justify-center">
                  {/* {!isMobile && activeObject && ( */}
                  {/* <div className="flex w-full items-center gap-1">
                     <ZoomContainer
                        containerRef={containerRef}
                        handleZoom={(v) => {
                           setContainerZoom(v);
                        }}
                        zoomLevel={containerZoom}
                     />
                  </div> */}
                  {/* {isMobile && <OptionsMobile canvasC={canvasC_ref} />} */}
                  <div className="border-1 shadow-lg rounded-xl bg-background p-2">
                     <OptionsMobile
                        containerRef={containerRef}
                        containerZoom={containerZoom}
                        setContainerZoom={setContainerZoom}
                     />
                  </div>
               </div>
            )}
         </div>

         {/* {right container} */}
         {isEdit && !isMobile && (
            <>
               <RightContainer
                  containerZoom={containerZoom}
                  containerRef={containerRef}
                  setContainerZoom={setContainerZoom}
               />
            </>
         )}
      </div>
   );
}

export default CanvasEditor;
