import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuLabel,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { debouncer } from "@/lib/utils";
import { IText } from "fabric";
import {
   ItalicIcon,
   LucideUnderline,
   TypeIcon,
   WeightIcon,
} from "lucide-react";
import { RefObject, useEffect, useState } from "react";
import CanvasC from "../canvas";
import { aligns, fonts, fontweights, textjustify } from "../constants";
import { useCanvasStore } from "../store";
import { Align } from "../types";

type props = {
   canvasC: RefObject<CanvasC | null>;
};

interface fontConfI {
   size: number;
   family: string;
   style: string;
   underline: boolean;
   weight: string | number;
   align: Align;
}

function FontOptions({ canvasC }: props) {
   const { activeObject } = useCanvasStore();

   const [fontconf, setFontConf] = useState<fontConfI>({
      size: 1,
      family: "",
      style: "normal",
      underline: false,
      weight: 500,
      align: "left",
   });

   const handleFont_family = (v: string) => {
      if (!canvasC.current || !activeObject) return;
      canvasC.current.changeCanvasProperties(activeObject, "fontFamily", v);
      setFontConf((p) => ({ ...p, family: v }));
   };
   const handleFont_Size = (v: number) => {
      if (!canvasC.current || !activeObject) return;
      canvasC.current.changeCanvasProperties(activeObject, "fontSize", v);
      setFontConf((p) => ({ ...p, size: v }));
   };

   const handleFontStyle = (t: string) => {
      if (!canvasC.current || !activeObject) return;
      canvasC.current.changeCanvasProperties(activeObject, "fontStyle", t);
      setFontConf((p) => ({ ...p, style: t }));
   };

   const handleUnderLine = () => {
      if (!canvasC.current || !activeObject) return;
      canvasC.current.changeCanvasProperties(
         activeObject,
         "underline",
         fontconf.underline ? false : true,
      );
      setFontConf((c) => ({ ...c, underline: c.underline ? false : true }));
   };

   const handleTextAlign = (v: Align) => {
      if (!canvasC.current || !activeObject) return;
      canvasC.current.changeCanvasProperties(activeObject, "textAlign", v);
      setFontConf((p) => ({ ...p, align: v }));
   };

   const handleWeight = (v: number) => {
      if (!canvasC.current || !activeObject) return;
      canvasC.current.changeCanvasProperties(activeObject, "fontWeight", v);
      setFontConf((p) => ({ ...p, v }));
   };

   useEffect(() => {
      if (activeObject instanceof IText) {
         setFontConf({
            family: activeObject.fontFamily,
            size: activeObject.fontSize,
            style: activeObject.fontStyle,
            underline: activeObject.underline,
            weight: activeObject.fontWeight,
            align: activeObject.textAlign as Align,
         });
      }
   }, [activeObject]);

   return (
      <div className="flex gap-1 justify-center items-center">
         <DropdownMenu>
            <DropdownMenuTrigger>
               <TypeIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-1 w-32">
               <div className="flex items-center gap-2">
                  {/* {font weights} */}
                  <DropdownMenu>
                     <DropdownMenuTrigger>
                        <WeightIcon />
                     </DropdownMenuTrigger>
                     <DropdownMenuContent asChild>
                        <div className="flex flex-col w-6">
                           {fontweights.map((w, i) => (
                              <Button
                                 onClick={() => {
                                    handleWeight(w);
                                 }}
                                 size="xs"
                                 variant={"outline"}
                                 className="w-6 h-6"
                                 key={i}
                              >
                                 {w}
                              </Button>
                           ))}
                        </div>
                     </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                     onClick={() => {
                        handleUnderLine();
                     }}
                     size={"xs"}
                     variant={fontconf.underline ? "default" : "outline"}
                  >
                     <LucideUnderline />
                  </Button>
                  <Button
                     onClick={() => {
                        if (fontconf.style === "italic") {
                           handleFontStyle("normal");
                        } else {
                           handleFontStyle("italic");
                        }
                     }}
                     size={"xs"}
                     variant={
                        fontconf.style === "italic" ? "default" : "outline"
                     }
                  >
                     <ItalicIcon />
                  </Button>
               </div>

               {/* {text alligns} */}
               <DropdownMenu>
                  <DropdownMenuTrigger className="text-sm">
                     Text Align
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="flex flex-col gap-1 items-center">
                     <div>
                        <DropdownMenuLabel>Align</DropdownMenuLabel>
                        {aligns.map((a, i) => (
                           <Button
                              onClick={() => {
                                 handleTextAlign(a.label);
                              }}
                              size={"xs"}
                              variant={
                                 fontconf.align === a.label
                                    ? "default"
                                    : "outline"
                              }
                              key={i}
                           >
                              <a.I />
                           </Button>
                        ))}
                     </div>
                     <div>
                        <DropdownMenuLabel>Justify</DropdownMenuLabel>
                        {textjustify.map((a, i) => (
                           <Button
                              onClick={() => {
                                 handleTextAlign(a.label);
                              }}
                              size={"xs"}
                              variant={
                                 fontconf.align === a.label
                                    ? "default"
                                    : "outline"
                              }
                              key={i}
                           >
                              <a.I />
                           </Button>
                        ))}
                        I
                     </div>
                  </DropdownMenuContent>
               </DropdownMenu>

               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button className="h-6" size={"xs"} variant={"outline"}>
                        {fontconf.family}
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="flex flex-col gap-0">
                     {fonts.map((f, i) => (
                        <Button
                           onClick={() => {
                              handleFont_family(f);
                           }}
                           className={`${f === fontconf.family && "bg-secondary border border-foreground"}`}
                           size={"xs"}
                           variant={"outline"}
                           key={i}
                        >
                           {f}
                        </Button>
                     ))}
                  </DropdownMenuContent>
               </DropdownMenu>
               <input
                  className="w-full"
                  type="number"
                  defaultValue={fontconf.size}
                  onChange={debouncer(
                     (e: React.ChangeEvent<HTMLInputElement>) => {
                        const v = parseInt(e.target.value);
                        if (v < 0) return;
                        handleFont_Size(v);
                     },
                     50,
                  )}
               />
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
}

export default FontOptions;
