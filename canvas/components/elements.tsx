import {
   CaseUpperIcon,
   Image,
   LucideIcon,
   PencilIcon,
   TriangleIcon,
} from "lucide-react";
import { whichOption } from "../types";
import CanvasC from "../canvas";
import { RefObject } from "react";
import { useWhichOptionsOpen } from "../store";
import { useIsMobile } from "../hooks/isMobile";
import { Button } from "@/components/ui/button";

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
function CanvasElementStandard({
   canvasC,
}: {
   canvasC: RefObject<CanvasC | null>;
}) {
   const { setWhichOption, which } = useWhichOptionsOpen();

   return (
      <div className="w-full h-full flex flex-col divide-y divide-foreground/50">
         {whichOptions.map((o, i) => (
            <Button
               variant={"simple"}
               size={null}
               onClick={() => {
                  if (!canvasC.current) return;

                  if (
                     o.label !== "draw" &&
                     canvasC.current.canvas.isDrawingMode
                  ) {
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
               className={`${o.label === which && "bg-accent font-bold"} w-full rounded-none py-2 px-3`}
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
      </div>
   );
}

export { CanvasElements };
