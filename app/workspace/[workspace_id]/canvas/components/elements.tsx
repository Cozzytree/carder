import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   ArrowBigRight,
   ArrowRight,
   CaseUpperIcon,
   CircleIcon,
   DiamondIcon,
   Hexagon,
   Image,
   LucideIcon,
   PencilIcon,
   ShapesIcon,
   Square,
   SquareX,
   Star,
   TextIcon,
   TriangleIcon,
} from "lucide-react";
import { canvasShapes, whichOption } from "../types";
import CanvasC from "../canvas";
import { RefObject } from "react";
import { useCanvasStore, useWhichOptionsOpen } from "../store";
import DrawOptions from "./draw_options";
import { c_paths } from "../constants";
import { useIsMobile } from "../hooks/isMobile";

const shapes: { shape: canvasShapes; I: LucideIcon; path?: string }[] = [
   { shape: "rect", I: Square },
   { shape: "circle", I: CircleIcon },
   { shape: "path", I: TriangleIcon, path: c_paths.triangle },
   {
      shape: "path",
      I: ArrowBigRight,
      path: c_paths.arrow_right,
   },
   {
      shape: "path",
      I: ArrowRight,
      path: c_paths.arrow_plane,
   },
   {
      shape: "path",
      I: Hexagon,
      path: c_paths.hexagon,
   },
   {
      shape: "path",
      I: DiamondIcon,
      path: c_paths.diamond,
   },
   {
      shape: "path",
      I: Star,
      path: c_paths.star,
   },
   {
      shape: "path",
      I: SquareX,
      path: c_paths.quadrilateral,
   },
];

const texts: { shape: canvasShapes; label: string; level: number }[] = [
   { shape: "i-text", label: "Heading", level: 1 },
   { shape: "i-text", label: "Body", level: 2 },
];

type props = {
   canvasC: RefObject<CanvasC | null>;
};

function CanvasElements({ canvasC }: props) {
   const { isDrawing } = useCanvasStore();
   const { isMobile } = useIsMobile();

   return (
      <>
         {isMobile ? (
            <CanvasElementsMobile isDrawing={isDrawing} canvasC={canvasC} />
         ) : (
            <CanvasElementStandard />
         )}
         {/* <div className="w-full h-full">asa</div>; */}
      </>
   );
}

function CanvasElementsMobile({
   canvasC,
   isDrawing,
}: props & { isDrawing: boolean }) {
   return (
      <>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <button className="text-sm text-foreground/80 flex flex-col items-center w-full">
                  <ShapesIcon />
                  Shapes
               </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
               className="h-fit w-fit place-items-center grid grid-cols-2 gap-2"
               side="right"
               align="start"
            >
               {shapes.map((s, i) => (
                  <DropdownMenuItem
                     onClick={() => {
                        if (!canvasC.current) return;
                        canvasC.current.createNewShape({
                           shapetype: s.shape,
                           path: s.path,
                        });
                     }}
                     key={i}
                     className="w-10 h-10 flex justify-center items-center"
                  >
                     <s.I className="w-10 h-10" />
                  </DropdownMenuItem>
               ))}
            </DropdownMenuContent>
         </DropdownMenu>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <button className="text-sm flex flex-col items-center w-full">
                  <TextIcon />
                  Text
               </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
               className="h-fit flex flex-col"
               side="right"
               align="start"
            >
               {texts.map((t, i) => (
                  <DropdownMenuItem
                     onClick={() => {
                        if (!canvasC.current) return;
                        canvasC.current.createNewShape(t.shape, t.level);
                     }}
                     key={i}
                  >
                     {t.label}
                  </DropdownMenuItem>
               ))}
            </DropdownMenuContent>
         </DropdownMenu>
         <div className="flex relative">
            <button
               onClick={() => {
                  if (!canvasC.current) return;
                  canvasC.current.canvasToggleDrawMode();
               }}
               className="flex flex-col items-center"
            >
               <PencilIcon className="w-6 h-7" />
               <span className="text-xs">Draw</span>
            </button>

            {isDrawing && (
               <div className="shadow-md border absolute left-[130%] flex flex-col items-center py-1 bg-secondary rounded-lg">
                  <DrawOptions canvasC={canvasC} />
               </div>
            )}
         </div>
      </>
   );
}

const whichOptions: { label: whichOption; I: LucideIcon }[] = [
   { label: "images", I: Image },
   { label: "text", I: CaseUpperIcon },
   { label: "shapes", I: TriangleIcon },
];
function CanvasElementStandard() {
   const { setWhichOption, which } = useWhichOptionsOpen();

   return (
      <div className="w-full flex flex-col divide-y-2">
         {whichOptions.map((o, i) => (
            <button
               onClick={() => {
                  if (which == o.label) {
                     setWhichOption(null);
                  } else setWhichOption(o.label);
               }}
               className={`${o.label === which && "bg-foreground/10"} flex py-2 flex-col items-center hover:bg-foreground/10 transition-all duration-75`}
               key={i}
            >
               <o.I />
               <span className="text-sm text-foreground/80">
                  {o.label[0].toUpperCase() + o.label.slice(1, o.label.length)}
               </span>
            </button>
         ))}
      </div>
   );
}

export { CanvasElementsMobile, CanvasElements };
