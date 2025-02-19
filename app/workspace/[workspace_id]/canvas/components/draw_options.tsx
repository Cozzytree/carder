import { RefObject, useState } from "react";
import CanvasC from "../canvas";
import { brushes } from "../constants";
import ColorOptions from "./color_options";
import { Button } from "@/components/ui/button";

type props = {
   canvasC: RefObject<CanvasC | null>;
};

function DrawOptions({ canvasC }: props) {
   const [currColor, setColor] = useState(
      canvasC.current?.brush_props.stroke_color || "",
   );

   return (
      <>
         {brushes.map((b, i) => (
            <div
               key={i}
               className="py-2 hover:scale-[1.4] cursor-pointer transition-all duration-150"
            >
               <button
                  onClick={() => {
                     if (!canvasC.current) return;
                     canvasC.current.setBrushType(b.btype);
                  }}
               >
                  <b.I />
                  {/* <SprayCanIcon className="" /> */}
               </button>
            </div>
         ))}

         <ColorOptions
            color={currColor}
            fn={(v) => {
               if (!canvasC.current) return;
               canvasC.current.setBrushColor(v);
               setColor(v);
            }}
         >
            <button className="w-7 h-7 rounded-full border-2"></button>
         </ColorOptions>
         <input type="number" className="w-16 bg-transparent" />
         {/* <div className="py-2 hover:scale-[1.4] cursor-pointer transition-all duration-150">
            <button>
               <SprayCanIcon className="" />
            </button>
         </div>
         <div className="py-2 hover:scale-[1.4] cursor-pointer transition-all duration-150">
            <button>
               <PencilIcon className="" />
            </button>
         </div>
         <div className="py-2 hover:scale-[1.4] cursor-pointer transition-all duration-150">
            <button>
               <EraserIcon className="" />
            </button>
         </div> */}
      </>
   );
}

export default DrawOptions;
