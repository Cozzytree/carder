import { Slider } from "@/components/ui/slider";
import { useCanvasStore } from "../../store";
import CanvasC from "../../canvas";
import { RefObject } from "react";
import { debouncer } from "@/lib/utils";
import ColorOptions from "./color_options";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ColorStop, Gradient } from "fabric";

type props = {
   canvasC: RefObject<CanvasC | null>;
};

function OutlineAndShadow({ canvasC }: props) {
   const { activeObject, setFabricObject } = useCanvasStore();

   const handleStroke = (v: number) => {
      if (!canvasC.current || !activeObject) return;
      canvasC.current.changeCanvasProperties(activeObject, "strokeWidth", v);
      setFabricObject(activeObject);
   };

   return (
      <div className="flex flex-col py-2 px-2">
         <h4>Stroke</h4>
         <div className="flex items-center gap-1">
            {activeObject?.get("strokeWidth")}
            <Slider
               defaultValue={[activeObject?.get("strokeWidth") || 0]}
               max={50}
               step={2}
               min={0}
               onValueChange={debouncer((e: number[]) => {
                  const v = e[0];
                  if (isNaN(v)) return;
                  handleStroke(v);
               }, 100)}
            />
         </div>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <button
                  className="w-6 h-6 border border-foreground rounded-full"
                  style={{
                     background: activeObject?.get("stroke"),
                  }}
               />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
               <ColorOptions
                  handleColor={(v) => {
                     if (!canvasC.current || !activeObject) return;
                     canvasC.current.changeCanvasProperties(
                        activeObject,
                        "stroke",
                        v,
                     );
                     setFabricObject(activeObject);
                  }}
                  handleGradient={(color) => {
                     if (!canvasC.current || !activeObject) return;
                     const divide = 1 / (color.length - 1);
                     const stops: ColorStop[] = color.map((c, i) => ({
                        color: c,
                        offset: divide * i,
                     }));
                     const gradient = new Gradient({
                        coords: {
                           x1: 0,
                           y1: 0,
                           x2: 0,
                           y2: activeObject.height,
                        },
                        type: "linear",
                        colorStops: stops,
                     });
                     canvasC.current.changeCanvasProperties(
                        activeObject,
                        "stroke",
                        gradient,
                     );
                     setFabricObject(activeObject);
                  }}
               />
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
}

export default OutlineAndShadow;
