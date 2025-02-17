import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CircleIcon,
  LucideIcon,
  ShapesIcon,
  Square,
  TextIcon,
  TriangleIcon,
} from "lucide-react";
import { canvasShapes } from "../types";
import CanvasC from "../canvas";
import { RefObject } from "react";
import { Button } from "@/components/ui/button";

const shapes: { shape: canvasShapes; I: LucideIcon }[] = [
  { shape: "rect", I: Square },
  { shape: "circle", I: CircleIcon },
  { shape: "triangle", I: TriangleIcon },
];

const texts: { shape: canvasShapes; label: string; level: number }[] = [
  { shape: "i-text", label: "Heading", level: 1 },
  { shape: "i-text", label: "Body", level: 2 },
];

type props = {
  canvasC: RefObject<CanvasC | null>;
};

function CanvasElements({ canvasC }: props) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-sm flex flex-col items-center w-full">
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
                canvasC.current.createNewShape(s.shape);
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
    </>
  );
}

export default CanvasElements;
