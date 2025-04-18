import CanvasC from "../canvas";
import ColorOptions from "./which_option_items/color_options";
import FontOptions from "./which_option_items/fonts_option(big)";
import OutlineAndShadow from "./which_option_items/outlineandShaodow";
import ResizeCanvas from "./which_option_items/resize_canvas";
import Shapes from "./which_option_items/shapes";
import TextOptions from "./which_option_items/texts_o";
import ImageOption from "./image_option";
import ImageFiltersOption from "./image_filter_options";
import DrawOptions from "./draw_options";
import UploadList from "@/components/uploads_list";

import { Gradient } from "fabric";
import { ChevronLeft } from "lucide-react";
import { RefObject, useEffect } from "react";
import { useCanvasStore, useWhichOptionsOpen } from "../store";
import { canvasShapes, textTypes, WhichOptionEmum } from "../types";
import { handleColorfill, handleGradient } from "../utilsfunc";
import { useParams } from "next/navigation";

type props = {
   canvasC: RefObject<CanvasC | null>;
};

function WhichOContainer({ canvasC }: props) {
   const params = useParams();

   const activeObject = useCanvasStore((state) => state.activeObject);
   const setFabricObject = useCanvasStore((state) => state.setFabricObject);

   const setWhichOption = useWhichOptionsOpen((state) => state.setWhichOption);
   const which = useWhichOptionsOpen((state) => state.which);

   const handleCreateShape = ({ scale, type, path, points }: { type: canvasShapes; path?: string; points?: { x: number; y: number }[]; scale?: number }) => {
      if (!canvasC.current) return;
      canvasC.current.createNewShape({ shapetype: type, path, points, scale });
   };

   const handleNewText = (type: textTypes) => {
      if (!canvasC.current) return;
      canvasC.current.createText(type);
   };

   useEffect(() => {
      if (!activeObject && which !== "images" && which !== "shapes" && which !== "text" && which !== "resize_canvas" && which !== "draw" && which !== "upload") {
         setWhichOption("color");
      }
   }, [activeObject, which]);

   return (
      <div className="h-full w-[250px] border-r relative">
         <h3 className="capitalize px-2 py-1 font-semibold">{which}</h3>

         {which === WhichOptionEmum.IMAGE && <ImageOption canvasC={canvasC} />}
         {which === WhichOptionEmum.UPLOAD && (
            <UploadList
               onClick={(url) => {
                  if (!canvasC.current) return;

                  canvasC.current.createNewImage(url);
               }}
               designId={(params?.editor_Id as string) || ""}
            />
         )}

         {which === WhichOptionEmum.SHAPE && <Shapes handleShape={handleCreateShape} />}
         {which === WhichOptionEmum.TEXT && <TextOptions handleNewText={handleNewText} />}
         {which === WhichOptionEmum.DRAW && (
            <div className="px-2">
               <DrawOptions canvasC={canvasC} />{" "}
            </div>
         )}

         {which === WhichOptionEmum.COLOR && canvasC.current != null && (
            <ColorOptions
               forCanvas={true}
               canvasC={canvasC}
               showGradient={true}
               showGradientOptions={true}
               width={canvasC.current.canvas.width}
               height={canvasC.current.canvas.height}
               color={(canvasC.current.canvas.backgroundColor as string | Gradient<"linear" | "radial">) || "#ffffff"}
               handleGradient={(g, t) => {
                  handleGradient({
                     type: t ? t : "linear",
                     activeObject: null,
                     canvasC: canvasC,
                     color: g,
                     fn: () => {
                        setFabricObject(activeObject);
                     },
                  });
               }}
               handleColor={(v) => {
                  handleColorfill({
                     activeObject: null,
                     canvasC: canvasC,
                     color: v,
                     fn: () => {
                        setFabricObject(activeObject);
                     },
                  });
               }}
            />
         )}

         {which === WhichOptionEmum.IMAGEFILTERS && <ImageFiltersOption canvasC={canvasC} />}

         {which === WhichOptionEmum.RESIZE_CANVAS && <ResizeCanvas canvasC={canvasC} />}

         {which === WhichOptionEmum.OUTLINE && <OutlineAndShadow canvasC={canvasC} />}

         {which === WhichOptionEmum.FONTS && <FontOptions canvasC={canvasC} />}

         <button className="border-2 rounded-full border-foreground/30 bg-secondary z-[51] absolute -right-4 top-1/2 -translate-y-1/2 text-background">
            <ChevronLeft
               onClick={() => {
                  setWhichOption(null);
               }}
            />
         </button>
      </div>
   );
}

export default WhichOContainer;
