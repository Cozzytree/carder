import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCanvasStore } from "../store";
import { RefObject, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Shadow } from "fabric";
import ColorOptions from "./color_options";
import CanvasC from "../canvas";
import { Slider } from "@/components/ui/slider";

type props = {
   canvasC: RefObject<CanvasC | null>;
};

function ShadowOption({ canvasC }: props) {
   const { activeObject } = useCanvasStore();
   const [isShadow, setShadow] = useState<Partial<Shadow> | null | undefined>(
      activeObject?.get("shadow"),
   );

   const shadow = new Shadow({
      blur: 4,
      offsetX: 3,
      offsetY: 2,
      color: "black",
   });
   const handleToggleShadow = (v: Partial<Shadow> | null | undefined) => {
      if (!canvasC.current || !activeObject) return;
      canvasC.current.changeCanvasProperties(activeObject, "shadow", v);
   };

   const handleChangeOffset = (v: number, o: "offsetX" | "offsetY") => {
      if (!canvasC.current || !activeObject || !isShadow) return;
      const s: Partial<Shadow> = isShadow;
      if (o == "offsetX") {
         s.offsetX = v;
      } else {
         s.offsetY = v;
      }
      canvasC.current.changeCanvasProperties(activeObject, "shadow", s);
      setShadow({ ...s });
   };

   const handleShadowColor = (v: string) => {
      if (!activeObject || !canvasC.current || !isShadow) return;
      const s = isShadow;
      s.color = v;
      canvasC.current.changeCanvasProperties(activeObject, "shadow", s);
      setShadow({ ...s });
   };

   const handleBlur = (v: number) => {
      if (!activeObject || !canvasC.current || !isShadow) return;
      const s = isShadow;
      s.blur = v;
      canvasC.current.changeCanvasProperties(activeObject, "shadow", s);
      setShadow({ ...s });
   };

   useEffect(() => {
      setShadow(activeObject?.get("shadow"));
   }, [activeObject]);

   return (
      <div className="flex justify-center items-center">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant={"outline"} size={"xs"} className="">
                  Shadow
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-2 items-center px-4">
               <Button
                  onClick={() => {
                     const is = isShadow ? null : shadow;
                     handleToggleShadow(is);
                     setShadow(is);
                  }}
                  size={"xs"}
                  variant={!isShadow ? "outline" : "default"}
                  className=""
               >
                  {isShadow ? "Enabled" : "Enable"}
               </Button>
               <div
                  className={`${isShadow ? "text-foreground" : "text-foreground/50"} flex flex-col gap-1`}
               >
                  <div className="flex items-center gap-1">
                     <span className="text-sm">Blur</span>
                     <Slider
                        onValueChange={(e) => {
                           handleBlur(e[0]);
                        }}
                        defaultValue={isShadow?.blur ? [isShadow.blur] : [0]}
                        min={0}
                        step={1}
                        max={10}
                     />
                  </div>

                  <div className="flex items-center gap-3">
                     <label className="text-sm">OffsetY</label>
                     <input
                        disabled={!isShadow}
                        type="number"
                        onChange={(e) => {
                           const v = Number(e.target.value);
                           handleChangeOffset(v, "offsetY");
                        }}
                        value={isShadow?.offsetY ? isShadow?.offsetY : 0}
                        className="w-14 px-2 text-sm"
                     />
                  </div>
                  <div className="flex items-center gap-3">
                     <label>OffsetX</label>
                     <input
                        disabled={!isShadow}
                        type="number"
                        onChange={(e) => {
                           const v = Number(e.target.value);
                           if (v < 0) return;
                           handleChangeOffset(v, "offsetX");
                        }}
                        value={isShadow?.offsetX ? isShadow.offsetX : 0}
                        className="w-14 px-2 text-sm"
                     />
                  </div>
                  <ColorOptions
                     fn={(v) => {
                        handleShadowColor(v);
                     }}
                     color={""}
                  >
                     <Button
                        size={"xs"}
                        variant={"outline"}
                        className="w-6 h-6"
                     />
                  </ColorOptions>
               </div>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
}

function OffsetOption() {}

export default ShadowOption;
