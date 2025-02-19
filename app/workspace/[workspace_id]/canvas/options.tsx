import CanvasC from "./canvas";
import StrokeOptions from "./components/stroke_options";
import FillOprions from "./components/fill_options";
import CanvasElements from "./components/elements";
import RadiusOption from "./components/radius_option";
import OpacityOption from "./components/opacity_option";
import ShadowOption from "./components/shadow_option";
import CanvasBackgroundOption from "./components/canvasb_options";
import FontOptions from "./components/font_options";

import { RefObject } from "react";
import { useCanvasStore } from "./store";
import CanvasActions from "./components/canvas_actions";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShapesIcon } from "lucide-react";
import { FabricObject } from "fabric";
import { Slider } from "@/components/ui/slider";

type props = {
   containerRef: RefObject<HTMLDivElement | null>;
   canvasC: RefObject<CanvasC | null>;
};

function CanvasOptions({ canvasC, containerRef }: props) {
   const { activeObject, containerScale, setContainerScale } = useCanvasStore();
   return (
      <>
         {/* {form small device} */}
         <div className="h-[4rem] w-full sm:hidden flex justify-between items-center px-3">
            {activeObject ? (
               <div className="mx-auto flex gap-2">
                  <Options activeObject={activeObject} canvasC={canvasC} />
               </div>
            ) : (
               <>
                  <DropdownMenu>
                     <DropdownMenuTrigger>
                        <ShapesIcon />
                     </DropdownMenuTrigger>
                     <DropdownMenuContent className="flex flex-col gap-1">
                        <CanvasElements canvasC={canvasC} />
                     </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="w-full flex justify-center items-center h-14 bg-foreground/10">
                     <div className="w-48 flex items-center gap-1">
                        <span>{(containerScale * 100).toFixed(0)}</span>
                        <Slider
                           defaultValue={[containerScale]}
                           onValueChange={(e) => {
                              const v = Number(e[0]);
                              if (containerRef.current) {
                                 setContainerScale(v / 100);
                                 containerRef.current.style.scale = `${v / 100}`;
                              }
                           }}
                           min={20}
                           // step={25}
                           max={300}
                        />
                     </div>
                  </div>
               </>
            )}
         </div>
         <div className="w-full hidden md:flex justify-center items-center h-14 bg-foreground/10">
            <div className="w-48 flex items-center gap-1">
               <span>{(containerScale * 100).toFixed(0)}</span>
               <Slider
                  defaultValue={[containerScale]}
                  onValueChange={(e) => {
                     const v = Number(e[0]);
                     if (containerRef.current) {
                        setContainerScale(v / 100);
                        containerRef.current.style.scale = `${v / 100}`;
                     }
                  }}
                  min={20}
                  // step={25}
                  max={300}
               />
            </div>
         </div>

         <div
            className={`hidden sm:flex z-[99] flex-col gap-2 items-center w-16 h-screen fixed top-[3%] left-0`}
         >
            <CanvasElements canvasC={canvasC} />
         </div>
         <div className="pointer-events-none w-full hidden sm:flex gap-2 justify-center items-center fixed left-0 top-[5%] min-h-[10px] px-2 md:px-10">
            <div className="pointer-events-auto w-fit px-2 shadow-md rounded-md py-1 flex gap-2 items-center border-[2px] bg-secondary">
               <Options activeObject={activeObject} canvasC={canvasC} />
            </div>
         </div>
      </>
   );
}

function Options({
   activeObject,
   canvasC,
}: {
   activeObject: FabricObject | undefined;
   canvasC: RefObject<CanvasC | null>;
}) {
   return (
      <>
         {activeObject && (
            <>
               {(activeObject.type === "text" ||
                  activeObject.type === "i-text") && (
                  <FontOptions canvasC={canvasC} />
               )}

               <ShadowOption canvasC={canvasC} />

               <OpacityOption
                  fn={(v) => {
                     if (!canvasC.current) return;
                     canvasC.current.changeCanvasProperties(
                        activeObject,
                        "opacity",
                        v,
                     );
                  }}
                  opacity={activeObject.get("opacity")}
               />

               <StrokeOptions
                  stroke={activeObject.stroke}
                  stroke_width={activeObject.strokeWidth}
                  fn={(v) => {
                     if (!canvasC.current) return;
                     canvasC.current.changeCanvasProperties(
                        activeObject,
                        "stroke",
                        v,
                     );
                  }}
                  fnStroke={(v) => {
                     if (!canvasC.current) return;
                     canvasC.current.changeCanvasProperties(
                        activeObject,
                        "strokeWidth",
                        v,
                     );
                  }}
               />
               <FillOprions
                  fn={(v) => {
                     if (!canvasC.current) return;
                     canvasC.current.changeCanvasProperties(
                        activeObject,
                        "fill",
                        v,
                     );
                  }}
                  stroke={activeObject.fill}
               />
               {activeObject.type !== "i-text" &&
                  activeObject.type !== "group" &&
                  activeObject.type !== "activeselection" && (
                     <RadiusOption
                        radiuses={activeObject?.rx}
                        fn={(v) => {
                           if (!canvasC.current) return;
                           canvasC.current.changeCanvasProperties(
                              activeObject,
                              "rx",
                              v,
                           );
                           canvasC.current.changeCanvasProperties(
                              activeObject,
                              "ry",
                              v,
                           );
                        }}
                     />
                  )}
            </>
         )}
         <CanvasBackgroundOption
            fn={(v) => {
               if (!canvasC.current) return;
               canvasC.current.changeCanvasColor(v);
            }}
            color={canvasC.current?.canvas.backgroundColor || ""}
         />

         {activeObject && <CanvasActions canvasC={canvasC} />}
      </>
   );
}

export default CanvasOptions;
