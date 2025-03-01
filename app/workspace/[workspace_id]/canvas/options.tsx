import CanvasC from "./canvas";
import OpacityOption from "./components/opacity_option";

import { CircleIcon } from "lucide-react";
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
import ShapeActions from "./components/canvas_options/shape_actions";
import { Button } from "@/components/ui/button";

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
    <div className="relative px-2 min-h-16 bg-secondary border-b-2 flex items-center">
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

              <Tooltip>
                <TooltipTrigger>
                  <OpacityOption
                    opacity={activeObj.get("opacity")}
                    fn={(v) => {
                      if (!canvasC.current || !activeObj) return;
                      canvasC.current.changeCanvasProperties(activeObj, {
                        opacity: v,
                      });
                      setFabricObject(activeObj);
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>Opacity</TooltipContent>
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
            </div>
          </TooltipProvider>
          <div className="z-50 p-1 border bg-secondary rounded-md absolute flex gap-2 items-center right-10 -bottom-14">
            <ShapeActions canvasC={canvasC} />
          </div>
        </>
      ) : (
        <div className="flex gap-2 text-sm">
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
            <span>Resize Canvas</span>
            <span>
              {width} x {height}
            </span>
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
