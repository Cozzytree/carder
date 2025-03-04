import CanvasC from "./canvas";
import ImageOption from "./components/image_option";
import RadiusOption from "./components/radius_option";
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
import { ColorStop, Gradient, Rect } from "fabric";
import {
  BrushIcon,
  FilterIcon,
  ImagesIcon,
  MousePointer2,
  PencilIcon,
  PencilLine,
  TypeIcon,
  TypeOutline,
} from "lucide-react";
import { RefObject } from "react";
import { useCanvasStore } from "./store";
import TextOptions from "./components/which_option_items/texts_o";
import FontOptionUpdated from "./components/font_option(updated)";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { brushes } from "./constants";
import { Slider } from "@/components/ui/slider";
import { debouncer } from "@/lib/utils";

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

  if (canvasC.current?.canvas.isDrawingMode) {
    return (
      <div className="w-full px-2 flex items-center gap-3 md:hidden">
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
    );
  }

  return (
    <div className="w-full px-2 flex items-center gap-3 md:hidden">
      {/* {resize canvas} */}
      <Popover>
        <PopoverTrigger>
          <Image
            className="w-5 h-5"
            src={"/board.svg"}
            width={100}
            height={100}
            alt="canvas"
          />
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2 w-fit">
          <ResizeCanvas canvasC={canvasC} />
          <Button
            onClick={() => {
              if (!canvasC.current) return;
              canvasC.current.canvas.discardActiveObject();
              canvasC.current.canvas.requestRenderAll();
            }}
            size={"xs"}
            variant={"outline"}
          >
            clear selection
          </Button>
        </PopoverContent>
      </Popover>

      {activeObject ? (
        <>
          {(activeObject.type === "text" ||
            activeObject.type === "textbox" ||
            activeObject.type === "i-text") && (
            <Popover>
              <PopoverTrigger>
                <TypeOutline className="w-4 h-4" />
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

          {/* {stroke} */}
          <Popover>
            <PopoverTrigger>
              <PencilLine className="w-4 h-4" />
            </PopoverTrigger>
            <PopoverContent>
              <OutlineAndShadow canvasC={canvasC} />
            </PopoverContent>
          </Popover>

          {activeObject.type === "image" && (
            <Popover>
              <PopoverTrigger>
                <FilterIcon className="w-4 h-4" />
              </PopoverTrigger>
              <PopoverContent
                sideOffset={10}
                className="p-4 w-[200px] max-h-[400px] overflow-y-auto"
              >
                <ImageFiltersOption canvasC={canvasC} />
              </PopoverContent>
            </Popover>
          )}

          {activeObject.type == "rect" && (
            <RadiusOption
              radiuses={activeObject instanceof Rect ? activeObject?.rx : 0}
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
          {/* {images} */}
          <Drawer>
            <DrawerTrigger>
              <ImagesIcon className="w-4 h-4" />
            </DrawerTrigger>
            <DrawerContent className="px-5 pb-10 h-[80vh]">
              <DrawerClose className="absolute right-3 top-3">
                close
              </DrawerClose>
              <DrawerTitle>Images</DrawerTitle>
              <ImageOption canvasC={canvasC} />
            </DrawerContent>
          </Drawer>

          {/* {draw} */}
          <button
            onClick={() => {
              if (!canvasC.current) return;
              canvasC.current.canvasToggleDrawMode();
            }}
          >
            <PencilIcon className="w-4 h-4" />
          </button>

          {/* {text} */}
          <Drawer>
            <DrawerTrigger>
              <TypeIcon className="w-4 h-4" />
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
            className="w-4 h-4 rounded-full border-2 border-foreground"
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
          <Image
            src={"/shapes_icon.svg"}
            alt="shapes"
            width={100}
            height={100}
            className="w-5 h-5"
          />
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
          <PopoverTrigger className="pl-2 text-sm border-l-2 border-foreground/30">
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
