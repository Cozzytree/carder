import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import UpDown from "@/components/updown";
import { debouncer } from "@/lib/utils";
import { ActiveSelection, FabricObject, Gradient, GradientType, Shadow, Group } from "fabric";
import { RefObject } from "react";
import CanvasC from "../../canvas";
import { useCanvasStore } from "../../store";
import ColorOptions from "./color_options";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import BtnWithColor from "../btn-with-color";
import { handleGradient } from "../../utilsfunc";
import { useIsMobile } from "../../hooks/isMobile";

type props = {
   canvasC: RefObject<CanvasC | null>;
};

function OutlineAndShadow({ canvasC }: props) {
   const { isMobile } = useIsMobile();
   const { activeObject, setFabricObject } = useCanvasStore();
   let hasShadow: Shadow | null = activeObject?.get("shadow");
   let strokeWidth: number = 0;

   const isActiveSelection =
      activeObject && (activeObject instanceof ActiveSelection || activeObject instanceof Group);

   const activeObjectStroke = isActiveSelection
      ? (activeObject?.getObjects().length && activeObject?.getObjects()[0].get("stroke")) || null
      : activeObject?.get("stroke") || null;

   const activeObjectWidth = isActiveSelection
      ? activeObject.getObjects().length
         ? activeObject.getObjects()[0].get("width")
         : 0
      : activeObject?.get("width");
   const activeObjectHeight = isActiveSelection
      ? activeObject.getObjects().length
         ? activeObject.getObjects()[0].get("height")
         : 0
      : activeObject?.get("height");

   if (isActiveSelection && activeObject.getObjects().length) {
      const o = activeObject.getObjects()[0];
      strokeWidth = o.get("strokeWidth") as number;
      hasShadow = o.get("shadow");
   } else {
      strokeWidth = activeObject?.get("strokeWidth");
      hasShadow = activeObject?.get("shadow");
   }

   const shadow = new Shadow({
      blur: 4,
      offsetX: 3,
      offsetY: 2,
      color: "black",
      nonScaling: true,
   });

   const check = () => {
      if (!canvasC.current || !activeObject) return false;
      return true;
   };

   const handleToggleShadow = () => {
      if (!check()) return;
      const a = activeObject as FabricObject;
      if (hasShadow) {
         canvasC.current?.changeCanvasProperties(a, { shadow: null });
      } else canvasC.current?.changeCanvasProperties(a, { shadow: shadow });
      setFabricObject(activeObject);
   };

   const handleShadowOffset = (type: "X" | "Y", n: number) => {
      if (!check() || !hasShadow) return;
      if (type == "X") {
         hasShadow.offsetX = n;
         canvasC.current?.changeCanvasProperties(activeObject as FabricObject, {
            shadow: hasShadow,
         });
      } else {
         hasShadow.offsetY = n;
         canvasC.current?.changeCanvasProperties(activeObject as FabricObject, {
            shadow: hasShadow,
         });
      }
      setFabricObject(activeObject);
   };

   const handleStroke = (v: number) => {
      if (!check()) return;
      canvasC.current?.changeCanvasProperties(activeObject as FabricObject, {
         strokeWidth: v,
      });
      activeObject?.setCoords();
      setFabricObject(activeObject);
   };

   return (
      <div className="flex gap-3 flex-col py-2 px-2">
         <div className="flex flex-col">
            <span className="select-none text-sm">Stroke</span>
            <div className="flex items-center gap-1">
               {strokeWidth}
               <Slider
                  className="h-3"
                  disabled={!!!activeObject}
                  defaultValue={[strokeWidth || 0]}
                  max={50}
                  step={2}
                  min={0}
                  onValueChange={debouncer((e: number[]) => {
                     const v = e[0];
                     if (isNaN(v)) return;
                     handleStroke(v);
                  }, 100)}
               />
               <Popover>
                  <PopoverTrigger>
                     <BtnWithColor color={activeObjectStroke} w={20} h={20} />
                  </PopoverTrigger>
                  <PopoverContent side={isMobile ? "top" : "left"} className="">
                     <ColorOptions
                        color={activeObjectStroke}
                        handleColor={(v) => {
                           if (!canvasC.current || !activeObject) return;
                           canvasC.current.changeCanvasProperties(activeObject, {
                              stroke: v,
                           });
                           setFabricObject(activeObject);
                        }}
                        handleGradient={(color, t) => {
                           if (activeObject)
                              handleGradient({
                                 activeObject: activeObject,
                                 canvasC: canvasC,
                                 color: color,
                                 fn: () => {
                                    setFabricObject(activeObject);
                                 },
                                 params: "stroke",
                                 type: t ? t : "linear",
                              });
                        }}
                     />
                  </PopoverContent>
               </Popover>
            </div>
         </div>

         <div>
            <span className="text-sm font-medium select-none">Dash Stroke</span>

            <Slider
               disabled={!!!activeObject}
               defaultValue={[
                  activeObject?.get("strokeDashArray")
                     ? activeObject?.get("strokeDashArray")[0]
                     : 0,
               ]}
               min={0}
               step={2}
               max={50}
               onValueChange={debouncer((e: number[]) => {
                  if (!canvasC.current || !activeObject) return;
                  canvasC.current.changeCanvasProperties(activeObject, {
                     strokeDashArray: [e[0], e[0]],
                  });
               }, 100)}
            />
         </div>

         <div className="flex flex-col justify-between">
            <div className="flex items-center justify-between">
               <label htmlFor="shadow" className="text-sm font-medium select-none">
                  Drop Shadow
               </label>
               <Checkbox
                  onCheckedChange={() => {
                     handleToggleShadow();
                  }}
                  checked={hasShadow != null ? true : false}
                  id="shadow"
               />
            </div>
            <div className="text-sm flex flex-col gap-2 mt-2">
               <div className="flex flex-col">
                  <label>OffsetX</label>
                  <UpDown
                     onChange={(v) => {
                        handleShadowOffset("X", v);
                     }}
                     disabled={!hasShadow}
                     defaultV={hasShadow?.offsetX}
                  />
               </div>

               <div className="flex flex-col">
                  <label>OffsetY</label>
                  <UpDown
                     onChange={(v) => {
                        handleShadowOffset("Y", v);
                     }}
                     disabled={!hasShadow}
                     defaultV={hasShadow?.offsetY}
                  />
               </div>

               <div className="w-full flex items-center justify-between">
                  <h4 className="flex-1 text-nowrap">Shadow Blur</h4>
                  <Slider
                     max={50}
                     disabled={!hasShadow}
                     defaultValue={[hasShadow?.blur || 0]}
                     onValueChange={debouncer((e: number[]) => {
                        if (!check() || !hasShadow) return;
                        hasShadow.blur = e[0];
                        canvasC.current?.changeCanvasProperties(activeObject as FabricObject, {
                           shadow: hasShadow,
                        });
                        setFabricObject(activeObject);
                     }, 50)}
                  />
               </div>

               <div className="w-full flex items-center justify-between">
                  <h4>Shadow Color</h4>
                  <Popover>
                     <PopoverTrigger>
                        <BtnWithColor color={hasShadow?.color || ""} w={28} h={28} />
                     </PopoverTrigger>
                     <PopoverContent
                        className="border-foreground/20"
                        side={isMobile ? "top" : "left"}
                     >
                        <ColorOptions
                           showGradient={false}
                           color={activeObjectStroke as string | Gradient<GradientType>}
                           forCanvas={false}
                           height={activeObjectHeight || 0}
                           width={activeObjectWidth || 0}
                           canvasC={canvasC}
                           handleColor={(v) => {
                              if (!check() || !hasShadow) return;
                              hasShadow.color = v;
                              canvasC.current?.changeCanvasProperties(
                                 activeObject as FabricObject,
                                 { shadow: hasShadow },
                              );
                           }}
                        />
                     </PopoverContent>
                  </Popover>
               </div>
            </div>
         </div>
      </div>
   );
}

export default OutlineAndShadow;
