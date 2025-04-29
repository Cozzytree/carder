import CanvasC from "../canvas";

import {
   CaseUpperIcon,
   Image,
   LucideIcon,
   PencilIcon,
   TriangleIcon,
   UploadIcon,
} from "lucide-react";
import { whichOption, WhichOptionEmum } from "../types";
import { RefObject } from "react";
import { useWhichOptionsOpen } from "../store";
import { useIsMobile } from "../hooks/isMobile";
import { Button } from "@/components/ui/button";
import { useEditorContext } from "./editor-wrapper";

type props = {
   canvasC: RefObject<CanvasC | null>;
};

function CanvasElements({ canvasC }: props) {
   const { isMobile } = useIsMobile();

   return <>{!isMobile && <CanvasElementStandard canvasC={canvasC} />}</>;
}

const whichOptions: { label: whichOption; I: LucideIcon }[] = [
   { label: "images", I: Image },
   { label: "text", I: CaseUpperIcon },
   { label: "shapes", I: TriangleIcon },
   { label: "draw", I: PencilIcon },
];
function CanvasElementStandard({ canvasC }: { canvasC: RefObject<CanvasC | null> }) {
   const { showUploads } = useEditorContext();
   const { setWhichOption, which } = useWhichOptionsOpen();

   return (
      <div className="w-full h-full flex flex-col divide-y divide-foreground/50">
         {whichOptions.map((o, i) => (
            <Button
               variant={"simple"}
               size={null}
               onClick={() => {
                  if (!canvasC.current) return;

                  if (o.label !== "draw" && canvasC.current.canvas.isDrawingMode) {
                     canvasC.current.canvasToggleDrawMode(false);
                  }

                  if (which == o.label) {
                     setWhichOption(null);
                  } else {
                     setWhichOption(o.label);
                     if (o.label === "draw") {
                        canvasC.current.canvasToggleDrawMode(true);
                     }
                  }
               }}
               className={`${o.label === which && "bg-accent font-bold"} flex flex-col items-center w-full rounded-none py-2 px-3`}
               key={i}
            >
               <o.I className="w-5 h-5" />
               <span className="text-sm text-start hidden lg:block">
                  {o.label[0].toUpperCase() + o.label.slice(1, o.label.length)}
               </span>
               {/* <span className="text-sm text-start">
                  {o.label[0].toUpperCase() + o.label.slice(1, o.label.length)}
               </span> */}
            </Button>
         ))}
         {showUploads && (
            <Button
               onClick={() => {
                  if (!canvasC.current) return;

                  setWhichOption(WhichOptionEmum.UPLOAD);
               }}
               className={`${which === "upload" && "bg-accent font-bold"} flex flex-col items-center w-full rounded-none py-2 px-3`}
               variant={"simple"}
               size={null}
            >
               <UploadIcon className="w-5 h-5" />

               <span className="text-sm text-start hidden lg:block">Uploads</span>
            </Button>
         )}
      </div>
   );
}

export { CanvasElements };
