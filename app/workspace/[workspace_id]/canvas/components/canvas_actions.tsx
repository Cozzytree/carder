import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   ArrowDown,
   ArrowUp,
   BringToFront,
   CopyIcon,
   SendToBack,
   TrashIcon,
} from "lucide-react";
import CanvasC from "../canvas";
import { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { useCanvasStore } from "../store";

type props = {
   canvasC: RefObject<CanvasC | null>;
};

function CanvasActions({ canvasC }: props) {
   const { activeObject } = useCanvasStore();

   const checkCanvas = () => {
      return canvasC.current && activeObject;
   };

   return (
      <div className="flex justify-center items-center px-2 border-l border-foreground">
         <div className="flex justify-center items-center gap-1">
            <Button
               onClick={() => {
                  if (!canvasC.current || !activeObject) return;
                  canvasC.current.deleteObject();
               }}
               className="w-7 h-7"
               size={"xs"}
               variant={"outline"}
            >
               <TrashIcon />
            </Button>
         </div>
         <Button
            onClick={() => {
               if (checkCanvas()) {
                  canvasC.current?.duplicateCanvasObject();
               }
            }}
            className="w-7 h-7"
            size={"xs"}
            variant={"outline"}
         >
            <CopyIcon />
         </Button>

         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button className="w-7 h-7" size={"xs"} variant={"outline"}>
                  <SendToBack />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="grid grid-cols-4 gap-1">
               <Button
                  onClick={() => {
                     if (checkCanvas()) {
                        canvasC.current?.changeCanvasObjectIndexes(
                           activeObject,
                           3,
                        );
                     }
                  }}
                  className="w-7 h-7"
                  size={"xs"}
                  variant={"outline"}
               >
                  <BringToFront />
               </Button>
               <Button
                  onClick={() => {
                     if (checkCanvas()) {
                        canvasC.current?.changeCanvasObjectIndexes(
                           activeObject,
                           2,
                        );
                     }
                  }}
                  className="w-7 h-7"
                  size={"xs"}
                  variant={"outline"}
               >
                  <ArrowUp />
               </Button>
               <Button
                  onClick={() => {
                     if (checkCanvas()) {
                        canvasC.current?.changeCanvasObjectIndexes(
                           activeObject,
                           1,
                        );
                     }
                  }}
                  className="w-7 h-7"
                  size={"xs"}
                  variant={"outline"}
               >
                  <ArrowDown />
               </Button>
               <Button
                  onClick={() => {
                     if (checkCanvas()) {
                        canvasC.current?.changeCanvasObjectIndexes(
                           activeObject,
                           4,
                        );
                     }
                  }}
                  className="w-7 h-7"
                  size={"xs"}
                  variant={"outline"}
               >
                  <SendToBack />
               </Button>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
}

export default CanvasActions;
