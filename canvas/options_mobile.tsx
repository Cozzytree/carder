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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ActiveSelection, Gradient, Rect } from "fabric";
import {
   BoxIcon,
   BrushIcon,
   FilterIcon,
   ImagesIcon,
   MousePointer2,
   PencilIcon,
   PencilLine,
   RedoIcon,
   SettingsIcon,
   TypeIcon,
   TypeOutline,
   UndoIcon,
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
import NextImage from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { brushes } from "./constants";
import { Slider } from "@/components/ui/slider";
import { debouncer } from "@/lib/utils";
import { handleGradient } from "./utilsfunc";
import BtnWithColor from "./components/btn-with-color";
import OpacityOption from "./components/opacity_option";
import InputWithValue from "./components/input-with-value";
import { useIsMobile } from "./hooks/isMobile";

function OptionsMobile({ canvasC }: { canvasC: RefObject<CanvasC | null> }) {
   const { activeObject, setFabricObject } = useCanvasStore();
   const { isMobile } = useIsMobile();

   if (canvasC.current?.canvas.isDrawingMode) {
      return (
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
                  canvasC.current.canvasToggleDrawMode(false);
               }}
            >
               <MousePointer2 cursor={"pointer"} className="w-5 h-5" />
            </button>
         </div>
      );
   }

   return (
      <div className="w-full px-2 flex items-center gap-3">
         {/* {resize canvas} */}
         {/* <Popover>
            <PopoverTrigger>
               <NextImage
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
                     setFabricObject(null);
                  }}
                  size={"xs"}
                  variant={"outline"}
               >
                  clear selection
               </Button>
               <label
                  htmlFor="c-img"
                  className={buttonVariants({ variant: "outline", size: "xs" })}
               >
                  change background
               </label>
               <input
                  onChange={(e) => {
                     if (!e.target.files?.length) return;
                     const file = e.target.files[0];
                     const reader = new FileReader();
                     const i = new Image();
                     reader.onload = async (e) => {
                        i.src = e.target?.result as string;

                        await canvasC.current?.changeCanvasBackground(i.src);
                     };
                     reader.readAsDataURL(file);
                  }}
                  className="hidden"
                  id="c-img"
                  type="file"
                  accept=".png, .jpeg, .webp"
               />
            </PopoverContent>
         </Popover> */}

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
                           <DropdownMenuTrigger className="text-sm">Fonts</DropdownMenuTrigger>
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

               {activeObject.type === "image" && isMobile && (
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
               <Popover>
                  <PopoverTrigger>
                     <ImagesIcon className="w-4 h-4" />
                  </PopoverTrigger>
                  <PopoverContent className="px-5 pb-10 h-[80vh]">
                     <ImageOption canvasC={canvasC} />
                  </PopoverContent>
               </Popover>

               {/* {draw} */}
               <button
                  onClick={() => {
                     if (!canvasC.current) return;
                     canvasC.current.canvasToggleDrawMode(true);
                  }}
               >
                  <PencilIcon className="w-4 h-4" />
               </button>

               {/* {text} */}
               <Popover>
                  <PopoverTrigger>
                     <TypeIcon className="w-4 h-4" />
                  </PopoverTrigger>
                  <PopoverContent className="px-5 pb-10">
                     <TextOptions
                        handleNewText={(v) => {
                           if (!canvasC.current) return;
                           canvasC.current.createText(v);
                        }}
                     />
                  </PopoverContent>
               </Popover>
            </>
         )}

         {/* {colors} */}
         {/* <Popover>
            <PopoverTrigger>
               <BtnWithColor
                  w={23}
                  h={23}
                  color={
                     activeObject instanceof ActiveSelection
                        ? activeObject.getObjects()[0].get("fill")
                        : activeObject?.get("fill")
                  }
               />
            </PopoverTrigger>
            <PopoverContent align="center" side="top" className="w-fit px-2 bg-background/90">
               <ColorOptions
                  showGradient={true}
                  showGradientOptions={true}
                  forCanvas={activeObject ? false : true}
                  height={activeObject ? activeObject?.height : canvasC.current?.canvas.width || 0}
                  width={activeObject ? activeObject?.width : canvasC.current?.canvas.height || 0}
                  canvasC={canvasC}
                  color={
                     activeObject instanceof ActiveSelection
                        ? activeObject.getObjects()[0].get("fill")
                        : activeObject?.get("fill") ||
                          (canvasC.current?.canvas.backgroundColor as
                             | string
                             | Gradient<"linear" | "radial">)
                  }
                  handleGradient={(v, gra) => {
                     if (activeObject) {
                        handleGradient({
                           params: "fill",
                           activeObject: activeObject,
                           canvasC: canvasC,
                           color: v,
                           fn: () => {
                              setFabricObject(activeObject);
                           },
                           type: gra,
                        });
                     } else {
                        handleGradient({
                           params: "fill",
                           activeObject: null,
                           canvasC: canvasC,
                           color: v,
                           fn: () => {
                              setFabricObject(activeObject);
                           },
                           type: gra,
                        });
                     }
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
         </Popover> */}

         <Popover>
            <PopoverTrigger>
               <BoxIcon />
            </PopoverTrigger>
            <PopoverContent>
               <Shapes
                  handleShape={({ type, path, points, scale }) => {
                     if (!canvasC.current) return;
                     canvasC.current.createNewShape({
                        shapetype: type,
                        path,
                        points,
                        scale,
                     });
                  }}
               />
            </PopoverContent>
         </Popover>

         {activeObject && isMobile && (
            <>
               <Popover>
                  <PopoverTrigger className="pl-2 text-sm border-l-2 border-foreground/30">
                     <SettingsIcon className="w-6 h-6" />
                  </PopoverTrigger>
                  <PopoverContent sideOffset={20} className="flex gap-2 flex-col bg-background/80">
                     <InputWithValue
                        val={activeObject ? activeObject?.get("left") : 0}
                        change={(e) => {
                           if (!canvasC.current || !activeObject) return;
                           canvasC.current.changeCanvasProperties(activeObject, {
                              left: e,
                           });
                           activeObject?.setCoords();
                           setFabricObject(activeObject);
                        }}
                     >
                        <span>x-axis</span>
                     </InputWithValue>
                     <InputWithValue
                        val={activeObject?.get("top") || 0}
                        change={(e) => {
                           if (!canvasC.current || !activeObject) return;

                           canvasC.current.changeCanvasProperties(activeObject, {
                              top: e,
                           });
                           activeObject.setCoords();
                           setFabricObject(activeObject);
                        }}
                     >
                        <span>y-axis</span>
                     </InputWithValue>

                     <InputWithValue
                        change={(e) => {
                           if (!canvasC.current || !activeObject) return;
                           canvasC.current.changeCanvasProperties(activeObject, {
                              scaleX: e,
                           });
                           activeObject.setCoords();
                           setFabricObject(activeObject);
                        }}
                        val={
                           activeObject instanceof ActiveSelection
                              ? activeObject.getObjects()[0].get("scaleX")
                              : activeObject?.get("scaleX") || 0
                        }
                     >
                        <span> scale X</span>
                     </InputWithValue>
                     <InputWithValue
                        change={(e) => {
                           if (!canvasC.current || !activeObject) return;
                           canvasC.current.changeCanvasProperties(activeObject, {
                              scaleY: e,
                           });
                           activeObject.setCoords();
                           setFabricObject(activeObject);
                        }}
                        val={
                           activeObject instanceof ActiveSelection
                              ? activeObject.getObjects()[0].get("scaleY")
                              : activeObject?.get("scaleY") || 0
                        }
                     >
                        <span>scale Y</span>
                     </InputWithValue>

                     <InputWithValue
                        val={activeObject?.get("angle") || 0}
                        change={(e) => {
                           if (!canvasC.current || !activeObject) return;
                           canvasC.current.changeCanvasProperties(activeObject, {
                              angle: e,
                           });
                           activeObject.setCoords();
                           setFabricObject(activeObject);
                        }}
                     >
                        <span>angle</span>
                     </InputWithValue>
                     <InputWithValue
                        val={
                           activeObject instanceof ActiveSelection
                              ? activeObject.getObjects()[0].get("width") || 0
                              : activeObject?.get("width") || 0
                        }
                        change={(e) => {
                           if (!canvasC.current || !activeObject) return;

                           canvasC.current.changeCanvasProperties(activeObject, {
                              width: e,
                           });
                           activeObject.setCoords();
                           setFabricObject(activeObject);
                        }}
                     >
                        <span>width</span>
                     </InputWithValue>
                     <InputWithValue
                        val={
                           activeObject instanceof ActiveSelection
                              ? activeObject.getObjects()[0].get("height") || 0
                              : activeObject?.get("height") || 0
                        }
                        change={(e) => {
                           if (!canvasC.current || !activeObject) return;
                           canvasC.current.changeCanvasProperties(activeObject, {
                              height: e,
                           });
                           activeObject.setCoords();
                           setFabricObject(activeObject);
                        }}
                     >
                        <span>height</span>
                     </InputWithValue>

                     <OpacityOption
                        fn={(v) => {
                           if (!canvasC.current || !activeObject) return;
                           canvasC.current.changeCanvasProperties(activeObject, {
                              opacity: v,
                           });
                        }}
                        opacity={activeObject?.get("opacity")}
                     />
                  </PopoverContent>
                  <ShapeActions canvasC={canvasC} />
               </Popover>
            </>
         )}

         <button
            onClick={() => {
               if (!canvasC.current) return;
               canvasC.current.undo();
            }}
         >
            <UndoIcon />
         </button>
         <button
            onClick={() => {
               if (!canvasC.current) return;
               canvasC.current.redo();
            }}
         >
            <RedoIcon />
         </button>
      </div>
   );
}

export default OptionsMobile;
