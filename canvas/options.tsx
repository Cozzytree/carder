import CanvasC from "./canvas";

import { BrushIcon, FilterIcon, MousePointer2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import CanvasBackgroundChange from "./components/canvas_background_change_modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const setFabricObject = useCanvasStore((state) => state.setFabricObject);
  const activeObject = useCanvasStore((state) => state.activeObject);
  const width = useCanvasStore((state) => state.width);
  const height = useCanvasStore((state) => state.height);
  const { setWhichOption } = useWhichOptionsOpen();

  return (
    <TooltipProvider>
      <div className="w-full relative px-2 min-h-16 gap-2 flex items-center border-b border-b-foreground/50">
        <div className="flex items-center gap-2 text-sm">
          <Tooltip>
            <TooltipTrigger asChild>
              <BtnWithColor
                w={25}
                h={25}
                onClick={() => {
                  setWhichOption("color");
                }}
                color={
                  canvasC.current?.canvas.backgroundColor as
                    | string
                    | Gradient<"linear" | "radical">
                }
              />
            </TooltipTrigger>
            <TooltipContent>canvas background color</TooltipContent>
          </Tooltip>

          {/* <ActiveColor
          fn={() => {
            setWhichOption("color");
          }}
          color={canvasC.current?.canvas.backgroundColor}
          label="change color"
        /> */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"xs"}
                variant={"outline"}
                className="flex flex-col items-center text-sm text-nowrap"
                onClick={() => {
                  setWhichOption("resize_canvas");
                }}
              >
                {width} x {height}
              </Button>
            </TooltipTrigger>
            <TooltipContent>canvas parameters</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <CanvasBackgroundChange
                handleChange={(e) => {
                  canvasC.current?.changeCanvasBackground(e);
                  setFabricObject(undefined);
                }}
              />
            </TooltipTrigger>
            <TooltipContent>canvas background image</TooltipContent>
          </Tooltip>

          {canvasC.current && canvasC.current.canvas.backgroundImage && (
            <Button
              onClick={() => {
                canvasC.current?.removeCanvasBackground();
                setFabricObject(undefined);
              }}
              size={"xs"}
              variant={"outline"}
            >
              Remove Background
            </Button>
          )}
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
                  className="w-6 h-6 rounded-full border border-foreground/50"
                  style={{
                    background: canvasC.current.brush_props.stroke_color,
                  }}
                />
              </PopoverTrigger>
              <PopoverContent className="w-fit flex flex-col gap-2">
                <ColorOptions
                  canvasC={canvasC}
                  width={canvasC.current.canvas.width || 0}
                  height={canvasC.current.canvas.height || 0}
                  color={
                    canvasC.current.canvas.backgroundColor as
                      | string
                      | Gradient<"linear" | "radial">
                  }
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
                canvasC.current.canvasToggleDrawMode(false);
                setWhichOption(null);
              }}
            >
              <MousePointer2 cursor={"pointer"} className="w-5 h-5" />
            </button>
          </div>
        )}

        {activeObject && activeObject.type === "image" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"xs"}
                variant={"simple"}
                onClick={() => {
                  setWhichOption("image-filters");
                }}
              >
                <FilterIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>image filters</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}

export default CanvasOptions;
