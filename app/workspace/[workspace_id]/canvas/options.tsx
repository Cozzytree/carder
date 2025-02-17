import CanvasC from "./canvas";

import { RefObject } from "react";
import { useCanvasStore } from "./store";
import StrokeOptions from "./components/stroke_options";
import FillOprions from "./components/fill_options";
import CanvasElements from "./components/elements";
import RadiusOption from "./components/radius_option";
import OpacityOption from "./components/opacity_option";
import ColorOptions from "./components/color_options";
import { Button } from "@/components/ui/button";

type props = {
  canvasC: RefObject<CanvasC | null>;
};

function CanvasOptions({ canvasC }: props) {
  const { activeObject } = useCanvasStore();
  return (
    <>
      <div className="flex z-[99] flex-col gap-2 items-center w-16 h-screen fixed top-10 left-0">
        <CanvasElements canvasC={canvasC} />
      </div>
      <div className="w-full flex gap-2 justify-end items-center fixed left-0 top-[5%] min-h-[10px] px-2 md:px-10">
        {activeObject && (
          <>
            <OpacityOption
              fn={(v) => {
                if (!canvasC.current) return;
                canvasC.current.changeCanvasProperties(
                  activeObject,
                  "opacity",
                  v,
                );
              }}
              opacity={activeObject.opacity}
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
        <div>
          <ColorOptions
            color={canvasC.current?.canvas.backgroundColor || ""}
            fn={(v) => {
              if (!canvasC.current) return;
              canvasC.current.changeCanvasColor(v);
            }}
          >
            <Button size={"xs"} variant={"outline"} className="w-6 h-6" />
          </ColorOptions>
        </div>
      </div>
    </>
  );
}

export default CanvasOptions;
