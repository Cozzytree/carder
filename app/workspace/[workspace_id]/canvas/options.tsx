import CanvasC from "./canvas";

import { BrushIcon, CircleIcon, MousePointer2 } from "lucide-react";
import { Dispatch, RefObject, SetStateAction } from "react";
import { useCanvasStore, useWhichOptionsOpen } from "./store";
import { useIsMobile } from "./hooks/isMobile";
import ActiveColor from "./components/active_color";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FontOptionUpdated from "./components/font_option(updated)";
import { Button } from "@/components/ui/button";
import { WhichOptionEmum } from "./types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { brushes } from "./constants";
import ColorOptions from "./components/which_option_items/color_options";
import { Slider } from "@/components/ui/slider";
import { debouncer } from "@/lib/utils";

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
  const {
    width,
    height,
    activeObject: activeObj,
    setFabricObject,
  } = useCanvasStore();
  const { setWhichOption, which } = useWhichOptionsOpen();

  return (
    <div className="w-full relative px-2 min-h-16 bg-secondary border-b-2 gap-2 flex items-center">
      {activeObj ? (
        <>
          <TooltipProvider>
            <div className="flex items-center gap-2">
              <ActiveColor
                fn={() => {
                  setWhichOption("color");
                }}
                color={activeObj.get("fill")}
                label="change color"
              />

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

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      setWhichOption("outline");
                    }}
                    className="flex flex-col text-xs items-center"
                  >
                    <span className="">Stroke/outline</span>
                    <CircleIcon className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Stroke and Shadow</TooltipContent>
              </Tooltip>

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

              <button
                className="text-sm"
                onClick={() => {
                  setWhichOption(WhichOptionEmum.OBJECTACTION);
                }}
              >
                actions
              </button>
            </div>
          </TooltipProvider>
        </>
      ) : (
        <div className="flex items-center gap-2 text-sm">
          <ActiveColor
            fn={() => {
              setWhichOption("color");
            }}
            color={""}
            label="change color"
          />
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
      )}

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

      <div>
        <Button
          size={"xs"}
          onClick={() => {
            if (!canvasC.current) return;
            canvasC.current.toggleCanvasSelection();
          }}
          variant={"outline"}
          className="text-sm"
        >
          Disable Selection
        </Button>
      </div>
    </div>
  );
}

export default CanvasOptions;
