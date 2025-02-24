import CanvasC from "./canvas";
import CanvasBackgroundOption from "./components/canvasb_options";
import FillOprions from "./components/fill_options";
import FontOptions from "./components/font_options";
import OpacityOption from "./components/opacity_option";
import RadiusOption from "./components/radius_option";
import ShadowOption from "./components/shadow_option";
import StrokeOptions from "./components/stroke_options";

import { FabricObject } from "fabric";
import { CircleIcon } from "lucide-react";
import { Dispatch, RefObject, SetStateAction } from "react";
import CanvasActions from "./components/canvas_actions";
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

type props = {
  containerRef: RefObject<HTMLDivElement | null>;
  canvasC: RefObject<CanvasC | null>;

  setContainerZoom: Dispatch<SetStateAction<number>>;
  containerZoom: number;
};

function CanvasOptions({
  canvasC,
  containerRef,
  setContainerZoom,
  containerZoom,
}: props) {
  const { activeObject } = useCanvasStore();
  const { isMobile } = useIsMobile();

  return (
    <>
      {isMobile ? (
        <OptionsMobile activeObject={activeObject} canvasC={canvasC} />
      ) : (
        <Options canvasC={canvasC} />
      )}
    </>
  );
}

function Options({ canvasC }: { canvasC: RefObject<CanvasC | null> }) {
  const { width, height, activeObject: activeObj } = useCanvasStore();
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
    </div>
  );
}

function OptionsMobile({
  activeObject,
  canvasC,
}: {
  activeObject: FabricObject | undefined;
  canvasC: RefObject<CanvasC | null>;
}) {
  return (
    <div className="flex gap-2 md:hidden">
      {activeObject && (
        <>
          {(activeObject.type === "text" ||
            activeObject.type === "textbox" ||
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
              canvasC.current.changeCanvasProperties(activeObject, "stroke", v);
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
              canvasC.current.changeCanvasProperties(activeObject, "fill", v);
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
                  canvasC.current.changeCanvasProperties(activeObject, "rx", v);
                  canvasC.current.changeCanvasProperties(activeObject, "ry", v);
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
  );
}

export default CanvasOptions;
