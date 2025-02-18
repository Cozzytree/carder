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
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import CanvasActions from "./components/canvas_actions";

type props = {
   canvasC: RefObject<CanvasC | null>;
};

function CanvasOptions({ canvasC }: props) {
   const { activeObject } = useCanvasStore();
   return (
      <>
         <div className="flex z-[99] flex-col gap-2 items-center w-16 h-screen fixed top-[3%] left-0">
            <CanvasElements canvasC={canvasC} />
         </div>
         <div className="pointer-events-none w-full flex gap-2 justify-center items-center fixed left-0 top-[5%] min-h-[10px] px-2 md:px-10">
            <div className="pointer-events-auto w-fit px-2 shadow-md rounded-md py-1 flex gap-2 items-center border-[2px] bg-secondary">
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
            </div>
         </div>
      </>
   );
}

export default CanvasOptions;
