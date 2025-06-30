import { RefObject } from "react";
import CanvasC from "../canvas";
import { aligns, fontweights } from "../constants";
import { Button } from "@/components/ui/button";
import { useCanvasStore } from "../store";
import { Align } from "../types";
import { LucideItalic, LucideUnderline } from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type props = {
   canvasC: RefObject<CanvasC | null>;
};

function FontOptionUpdated({ canvasC }: props) {
   const { activeObject, setFabricObject } = useCanvasStore();

   const handleTextAlign = (v: Align) => {
      if (!canvasC.current || !activeObject) return;
      canvasC.current.changeCanvasProperties(activeObject, { textAlign: v });
      setFabricObject(activeObject);
   };

   const handleUnderLine = () => {
      if (!canvasC.current || !activeObject) return;
      canvasC.current.changeCanvasProperties(activeObject, {
         underline: activeObject.get("underline") ? false : true,
      });
      setFabricObject(activeObject);
   };

   const handleFontStyle = (t: string) => {
      if (!canvasC.current || !activeObject) return;
      canvasC.current.changeCanvasProperties(activeObject, { fontStyle: t });
      setFabricObject(activeObject);
   };
   const handleFontWeight = (n: number) => {
      if (!canvasC.current || !activeObject) return;
      canvasC.current.changeCanvasProperties(activeObject, { fontWeight: n });
      setFabricObject(activeObject);
   };

   return (
      <div className="flex flex-wrap items-center gap-2">
         <div className="flex gap-[1px]">
            {aligns.map((a, i) => (
               <Button
                  onClick={() => {
                     handleTextAlign(a.label);
                  }}
                  className={`${a.label === activeObject?.get("textAlign") && "bg-foreground/20"}`}
                  variant={"outline"}
                  size={"xs"}
                  key={i}
               >
                  <a.I />
               </Button>
            ))}
         </div>

         <Button
            onClick={handleUnderLine}
            className={`${activeObject?.get("underline") && "bg-foreground/20"}`}
            variant={"outline"}
            size={"xs"}
         >
            <LucideUnderline />
         </Button>

         <Button
            onClick={() => {
               if (activeObject?.get("fontStyle") === "italic") {
                  handleFontStyle("normal");
               } else {
                  handleFontStyle("italic");
               }
            }}
            className={`${activeObject?.get("fontStyle") === "italic" && "bg-foreground/20"}`}
            variant={"outline"}
            size={"xs"}
         >
            <LucideItalic />
         </Button>

         <DropdownMenu>
            <DropdownMenuTrigger className="text-xs flex flex-col">
               <span className="text-nowrap">Font Weight</span>
               {activeObject?.get("fontWeight")}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="">
               {fontweights.map((f, i) => (
                  <DropdownMenuItem
                     onClick={() => {
                        handleFontWeight(f);
                     }}
                     className={`${activeObject?.get("fontWeight") == f && "bg-foreground/20"}`}
                     key={i}
                  >
                     {f}
                  </DropdownMenuItem>
               ))}
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
}

export default FontOptionUpdated;
