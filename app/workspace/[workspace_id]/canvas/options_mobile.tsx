import CanvasC from "./canvas";
import OpacityOption from "./components/opacity_option";
import RadiusOption from "./components/radius_option";
import FontOptions from "./components/which_option_items/fonts_option(big)";

import { RefObject } from "react";
import { useCanvasStore } from "./store";
import ResizeCanvas from "./components/which_option_items/resize_canvas";
import ColorOptions from "./components/which_option_items/color_options";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColorStop, Gradient } from "fabric";
import Shapes from "./components/which_option_items/shapes";
import { ImagesIcon, PencilLine, ShapesIcon } from "lucide-react";
import OutlineAndShadow from "./components/which_option_items/outlineandShaodow";
import ImageOption from "./components/image_option";
import ShapeActions from "./components/canvas_options/shape_actions";
import ImageFiltersOption from "./components/image_filter_options";

function OptionsMobile({ canvasC }: { canvasC: RefObject<CanvasC | null> }) {
  const { activeObject, setFabricObject } = useCanvasStore();

  const handleGradient = (color: string[]) => {
    if (!canvasC.current) return;
    const divide = 1 / (color.length - 1);
    if (activeObject) {
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
      canvasC.current.changeCanvasProperties(activeObject, {
        fill: gradient,
      });
    } else {
      const gradient = new Gradient({
        coords: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: canvasC.current.canvas.height,
        },
        type: "linear",
        colorStops: color.map((c, i) => ({ color: c, offset: divide * i })),
      });
      canvasC.current.changeCanvasColor(gradient);
    }
    setFabricObject(activeObject);
  };

  return (
    <div className="w-full flex gap-2 md:hidden">
      {activeObject ? (
        <>
          {(activeObject.type === "text" ||
            activeObject.type === "textbox" ||
            activeObject.type === "i-text") && (
            <FontOptions canvasC={canvasC} />
          )}

          {/* <ShadowOption canvasC={canvasC} /> */}

          <OpacityOption
            fn={(v) => {
              if (!canvasC.current) return;
              canvasC.current.changeCanvasProperties(activeObject, {
                opacity: v,
              });
            }}
            opacity={activeObject.get("opacity")}
          />

          <DropdownMenu>
            <DropdownMenuTrigger>
              <PencilLine />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <OutlineAndShadow canvasC={canvasC} />
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <ImagesIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <ImageOption canvasC={canvasC} />
            </DropdownMenuContent>
          </DropdownMenu>
          {activeObject.type === "image" && (
            <DropdownMenu>
              <DropdownMenuTrigger>Filters</DropdownMenuTrigger>
              <DropdownMenuContent
                sideOffset={10}
                className="p-4 w-[200px] max-h-[400px] overflow-y-auto"
              >
                <ImageFiltersOption canvasC={canvasC} />
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {activeObject.type !== "i-text" &&
            activeObject.type !== "group" &&
            activeObject.type !== "activeselection" && (
              <RadiusOption
                radiuses={activeObject?.rx}
                fn={(v) => {
                  if (!canvasC.current) return;
                  canvasC.current.changeCanvasProperties(activeObject, {
                    rx: v,
                  });
                  canvasC.current.changeCanvasProperties(activeObject, {
                    ry: v,
                  });
                }}
              />
            )}
        </>
      ) : (
        <>
          <ResizeCanvas canvasC={canvasC} />
        </>
      )}

      {/* {colors} */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            style={{
              background:
                activeObject?.get("fill") ||
                canvasC.current?.canvas.backgroundColor,
            }}
            className="w-6 h-6 rounded-full border-2 border-foreground"
          ></button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="top">
          <ColorOptions
            handleGradient={(v) => {
              handleGradient(v);
            }}
            handleColor={(v) => {
              if (!canvasC.current) return;
              if (!activeObject) {
                canvasC.current.changeCanvasColor(v);
              } else {
                canvasC.current.changeCanvasProperties(activeObject, {
                  fill: v,
                });
              }
              setFabricObject(activeObject);
            }}
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <ShapesIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Shapes
            handleShape={(type, path) => {
              if (!canvasC.current) return;
              canvasC.current.createNewShape({ shapetype: type, path });
            }}
          />
        </DropdownMenuContent>
      </DropdownMenu>
      {/*
      <CanvasBackgroundOption
        fn={(v) => {
          if (!canvasC.current) return;
          canvasC.current.changeCanvasColor(v);
        }}
        color={canvasC.current?.canvas.backgroundColor || ""}
      /> */}

      {activeObject && (
        <DropdownMenu>
          <DropdownMenuTrigger className="pl-2 border-l-2 border-foreground/30">
            Actions
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex gap-2">
            <ShapeActions canvasC={canvasC} />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export default OptionsMobile;
