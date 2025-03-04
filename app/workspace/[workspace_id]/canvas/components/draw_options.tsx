import { RefObject } from "react";
import CanvasC from "../canvas";
import { brushes } from "../constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ColorOptions from "./which_option_items/color_options";
import { Slider } from "@/components/ui/slider";
import { debouncer } from "@/lib/utils";
import ShapeActions from "./canvas_options/shape_actions";

type props = {
  canvasC: RefObject<CanvasC | null>;
};

function DrawOptions({ canvasC }: props) {
  const strokeColor = canvasC.current?.brush_props.stroke_color || "";
  const strokeWidth = canvasC.current?.brush_props.stroke || 0;

  const check = () => {
    if (!canvasC.current) return false;
    return true;
  };

  return (
    <>
      <div className="">
        {brushes.map((b, i) => (
          <div key={i} className="py-2">
            <button
              className="hover:scale-[1.2] transition-all duration-150 cursor-pointer"
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
      </div>
      <div className="flex flex-col">
        <h4>Stroke color</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-6 h-6 rounded-full bg-foreground/80"
              style={{ background: strokeColor }}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start">
            <ColorOptions
              handleGradient={(e) => {}}
              handleColor={(c) => {
                if (!check()) return;
                canvasC.current?.setBrushColor(c);
              }}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col">
        <h4>Stroke Wifth</h4>
        <Slider
          defaultValue={[strokeWidth]}
          onValueChange={debouncer((e: number[]) => {
            if (!check()) return;
            const n = e[0];
            if (n < 0) return;
            canvasC.current?.setBrushWidth(n);
          })}
        />
      </div>
    </>
  );
}

export default DrawOptions;
