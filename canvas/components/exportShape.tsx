import CanvasC from "../canvas";

import { RefObject, useState } from "react";
import { useCanvasStore } from "../store";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Props = {
   canvasC: RefObject<CanvasC | null>;
};

const exportOptions = ["svg", "image"];

export default function ExportShape({}: Props) {
   const { activeObject } = useCanvasStore();
   const [filename, setFilename] = useState("");
   const [activeOption, setActiveOption] = useState<string | null>(null);
   const [isOpen, setOpen] = useState(false);

   const handleExport = () => {
      if (!activeObject) return;
      if (activeOption === "image") {
         const data = activeObject.toDataURL();
         const link = document.createElement("a");
         link.href = data;
         link.download = `${filename}.png`; // Default filename
         link.click();
      } else if (activeOption === "svg") {
         const svgData = activeObject.toSVG();
         const blob = new Blob([new TextEncoder().encode(svgData)], {
            type: "image/svg+xml;charset=utf-8",
         });
         const url = URL.createObjectURL(blob);
         const link = document.createElement("a");
         link.href = url;
         link.download = `${filename || "export"}.svg`;
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         URL.revokeObjectURL(url);
      }
      setOpen(false);
   };

   return (
      <div>
         <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent>
               <DialogTitle>Export Shape</DialogTitle>
               <Input
                  onChange={(e) => {
                     setFilename(e.target.value);
                  }}
                  placeholder="filename"
               />
               <DialogFooter className="gap-3">
                  <DialogClose>close</DialogClose>
                  <Button onClick={handleExport}>save</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         {exportOptions.map((e, i) => (
            <Button
               key={i}
               variant={"outline"}
               size={"xs"}
               onClick={() => {
                  setActiveOption(e);
                  setOpen(true);
               }}
            >
               {e}
            </Button>
         ))}
      </div>
   );
}
