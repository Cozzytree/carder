import CanvasC from "./canvas";
import ImageOption from "./components/image_option";
import RadiusOption from "./components/radius_option";
import OpacityOption from "./components/opacity_option";
import Shapes from "./components/which_option_items/shapes";
import ImageFiltersOption from "./components/image_filter_options";
import ShapeActions from "./components/canvas_options/shape_actions";
import ColorOptions from "./components/which_option_items/color_options";
import ResizeCanvas from "./components/which_option_items/resize_canvas";
import FontOptions from "./components/which_option_items/fonts_option(big)";
import OutlineAndShadow from "./components/which_option_items/outlineandShaodow";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ColorStop, Gradient } from "fabric";
import {
  CaseUpper,
  ImagesIcon,
  PencilIcon,
  PencilLine,
  ShapesIcon,
  Type,
  TypeIcon,
  TypeOutline,
} from "lucide-react";
import { RefObject } from "react";
import { useCanvasStore } from "./store";
import DrawOptions from "./components/draw_options";
import TextOptions from "./components/which_option_items/texts_o";
import FontOptionUpdated from "./components/font_option(updated)";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <div className="w-full flex gap-3 md:hidden">
      {activeObject ? (
        <>
          {(activeObject.type === "text" ||
            activeObject.type === "textbox" ||
            activeObject.type === "i-text") && (
            <Popover>
              <PopoverTrigger>
                <TypeOutline />
              </PopoverTrigger>
              <PopoverContent className="space-y-2">
                <FontOptionUpdated canvasC={canvasC} />
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-sm">
                    Fonts
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="right">
                    <FontOptions canvasC={canvasC} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </PopoverContent>
            </Popover>
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

          {/* {stroke} */}
          <Popover>
            <PopoverTrigger>
              <PencilLine />
            </PopoverTrigger>
            <PopoverContent>
              <OutlineAndShadow canvasC={canvasC} />
            </PopoverContent>
          </Popover>

          {activeObject.type === "image" && (
            <Popover>
              <PopoverTrigger>Filters</PopoverTrigger>
              <PopoverContent
                sideOffset={10}
                className="p-4 w-[200px] max-h-[400px] overflow-y-auto"
              >
                <ImageFiltersOption canvasC={canvasC} />
              </PopoverContent>
            </Popover>
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
          {/* {resize canvas} */}
          <Popover>
            <PopoverTrigger>Resize Canvas</PopoverTrigger>
            <PopoverContent className="flex flex-col w-fit">
              <ResizeCanvas canvasC={canvasC} />
            </PopoverContent>
          </Popover>

          {/* {images} */}
          <Drawer>
            <DrawerTrigger>
              <ImagesIcon />
            </DrawerTrigger>
            <DrawerContent className="px-5 pb-10">
              <DrawerClose className="absolute right-3 top-3">
                close
              </DrawerClose>
              <DrawerTitle>Images</DrawerTitle>
              <ImageOption canvasC={canvasC} />
            </DrawerContent>
          </Drawer>

          {/* {draw} */}
          <Drawer>
            <DrawerTrigger
              onClick={() => {
                if (!canvasC.current) return;
                canvasC.current.canvasToggleDrawMode();
              }}
            >
              <PencilIcon />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerContent className="px-5 pb-10">
                <DrawerClose className="absolute right-3 top-3">
                  close
                </DrawerClose>
                <DrawerTitle>Draw</DrawerTitle>
                <DrawOptions canvasC={canvasC} />
              </DrawerContent>
            </DrawerContent>
          </Drawer>

          {/* {text} */}
          <Drawer>
            <DrawerTrigger>
              <TypeIcon />
            </DrawerTrigger>
            <DrawerContent className="px-5 pb-10">
              <DrawerTitle>Text</DrawerTitle>
              <DrawerClose className="absolute right-3 top-3">
                close
              </DrawerClose>
              <TextOptions
                handleNewText={(v) => {
                  if (!canvasC.current) return;
                  canvasC.current.createText(v);
                }}
              />
            </DrawerContent>
          </Drawer>
        </>
      )}

      {/* {colors} */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            style={{
              background:
                activeObject?.get("fill") ||
                canvasC.current?.canvas.backgroundColor,
            }}
            className="w-6 h-6 rounded-full border-2 border-foreground"
          ></button>
        </PopoverTrigger>
        <PopoverContent align="center" side="top">
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
        </PopoverContent>
      </Popover>

      <Drawer>
        <DrawerTrigger>
          <ShapesIcon />
        </DrawerTrigger>
        <DrawerContent className="px-5 space-y-3 pb-6 pt-2">
          <DrawerClose className="absolute right-3 top-3">close</DrawerClose>
          <DrawerTitle>Shapes</DrawerTitle>
          <Shapes
            handleShape={(type, path) => {
              if (!canvasC.current) return;
              canvasC.current.createNewShape({ shapetype: type, path });
            }}
          />
        </DrawerContent>
      </Drawer>

      {activeObject && (
        <Popover>
          <PopoverTrigger className="pl-2 border-l-2 border-foreground/30">
            Actions
          </PopoverTrigger>
          <PopoverContent sideOffset={20} className="flex gap-2 w-fit">
            <ShapeActions canvasC={canvasC} />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

export default OptionsMobile;
