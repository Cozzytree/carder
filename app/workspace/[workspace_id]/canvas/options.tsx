import CanvasC from "./canvas";

import { BrushIcon, MousePointer2 } from "lucide-react";
import { Dispatch, RefObject, SetStateAction } from "react";
import { useCanvasStore, useWhichOptionsOpen } from "./store";
import { useIsMobile } from "./hooks/isMobile";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { brushes } from "./constants";
import ColorOptions from "./components/which_option_items/color_options";
import { Slider } from "@/components/ui/slider";
import { debouncer } from "@/lib/utils";
import BtnWithColor from "./components/btn-with-color";
import { Gradient } from "fabric";

type props = {
  containerRef: RefObject<HTMLDivElement | null>;
  canvasC: RefObject<CanvasC | null>;

  setContainerZoom: Dispatch<SetStateAction<number>>;
  containerZoom: number;
};

function CanvasOptions({ canvasC }: props) {
  const { isMobile } = useIsMobile();

  return <>{!isMobile && <Options canvasC={canvasC} />}</>;
}

function Options({ canvasC }: { canvasC: RefObject<CanvasC | null> }) {
  const { width, height, activeObject: activeObj } = useCanvasStore();
  const { setWhichOption, which } = useWhichOptionsOpen();

  return (
    <div className="w-full relative px-2 min-h-16 bg-secondary border-b-2 gap-2 flex items-center">
      {/* {activeObj ? (
        <>
          <TooltipProvider>
            <div className="flex items-center gap-2">
              {(activeObj.type === "i-text" ||
                activeObj.type === "textbox") && (
                <>
                  <button
                    className={`${which === "fonts" && "bg-foreground/20 p-[4px] rounded-md"}`}
                    onClick={() => {
                      setWhichOption("fonts");
                    }}
                  >
                    {activeObj.get("fontFamily")}
                  </button>
                  <FontOptionUpdated canvasC={canvasC} />
                </>
              )}

              {activeObj.type === "image" && (
                <>
                  <button
                    onClick={() => {
                      setWhichOption("image-filters");
                    }}
                  >
                    Filters
                  </button>
                </>
              )}
            </div>
          </TooltipProvider>
        </>
      ) : (
        <></>
      )} */}
      <div className="flex items-center gap-2 text-sm">
        <BtnWithColor
          onClick={() => {
            setWhichOption("color");
          }}
          color={
            canvasC.current?.canvas.backgroundColor as
              | string
              | Gradient<"linear" | "radical">
          }
        />
        {/* <ActiveColor
          fn={() => {
            setWhichOption("color");
          }}
          color={canvasC.current?.canvas.backgroundColor}
          label="change color"
        /> */}
        <button
          className="flex flex-col items-center text-sm"
          onClick={() => {
            setWhichOption("resize_canvas");
          }}
        >
          <span className="text-sm text-nowrap">Resize Canvas</span>
          <span className="text-sm text-nowrap">
            {width} x {height}
          </span>
        </button>
      </div>

      {canvasC.current?.canvas.isDrawingMode && (
        <div className="w-full px-2 flex items-center gap-3">
          <Popover>
            <PopoverTrigger>
              <BrushIcon className="2-5 h-5" />
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              {brushes.map((b, i) => (
                <div key={i} className="py-2">
                  <button
                    className="hover:scale-[1.2] transition-all duration-150 cursor-pointer"
                    onClick={() => {
                      if (!canvasC.current) return;
                      canvasC.current.setBrushType(b.btype);
                    }}
                  >
                    <b.I className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button
                className="w-5 h-5 rounded-full border border-foreground/50"
                style={{ background: canvasC.current.brush_props.stroke_color }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-fit flex flex-col gap-2">
              <ColorOptions
                color={
                  canvasC.current.canvas.backgroundColor as
                    | string
                    | Gradient<"linear" | "radial">
                }
                handleGradient={(e) => {}}
                handleColor={(c) => {
                  if (!canvasC.current) return;
                  canvasC.current?.setBrushColor(c);
                }}
              />
              <div>
                <h4>Stroke</h4>
                <Slider
                  min={1}
                  max={100}
                  step={1}
                  defaultValue={[canvasC.current.brush_props.stroke]}
                  onValueChange={debouncer((e: number[]) => {
                    if (!canvasC.current) return;
                    const n = e[0];
                    if (n < 0) return;
                    canvasC.current?.setBrushWidth(n);
                  })}
                />
              </div>
            </PopoverContent>
          </Popover>

          <button
            onClick={() => {
              if (!canvasC.current) return;
              canvasC.current.canvasToggleDrawMode();
            }}
          >
            <MousePointer2 cursor={"pointer"} className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default CanvasOptions;
