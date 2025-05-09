import { Button } from "@/components/ui/button";
import { saveOptions } from "../constants";
import { useEditorContext } from "./editor-wrapper";
import { useState } from "react";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function SaveCanvas() {
   const [isSave, setSave] = useState<"image" | "json" | null>(null);
   const [fileName, setFileName] = useState("");
   const { canvas } = useEditorContext();

   return (
      <>
         <Dialog
            open={isSave ? true : false}
            onOpenChange={() => {
               setSave(null);
            }}
         >
            <DialogContent>
               <DialogTitle>Save Canvas</DialogTitle>
               <div>
                  <Input
                     onChange={(e) => {
                        setFileName(e.target.value);
                     }}
                     placeholder="Name..."
                  />
               </div>
               <DialogFooter className="gap-3">
                  <DialogClose className="text-sm">close</DialogClose>
                  <Button
                     size={"sm"}
                     variant={"default"}
                     onClick={() => {
                        if (!isSave) return;
                        canvas?.current?.saveCanvasAs(isSave, fileName);
                        setSave(null);
                     }}
                  >
                     save
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
         <div className="flex flex-col">
            {saveOptions.map((o, i) => (
               <Button
                  onClick={() => {
                     setSave(o.t);
                  }}
                  size={"xs"}
                  variant={"simple"}
                  className="w-full"
                  key={i}
               >
                  {o.label}
               </Button>
            ))}
         </div>
      </>
   );
}
