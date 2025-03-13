import { RefObject } from "react";
import CanvasC from "../../canvas";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowDown,
  ArrowUp,
  BringToFrontIcon,
  CopyIcon,
  FlipHorizontal2,
  FlipVertical2,
  LockIcon,
  LucideBringToFront,
  LucideIcon,
  SendToBackIcon,
  TrashIcon,
} from "lucide-react";
import { useCanvasStore } from "../../store";
import { Button } from "@/components/ui/button";
import { FabricObject } from "fabric";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const index_options: { label: string; I: LucideIcon }[] = [
  { I: ArrowDown, label: "Send Backward" },
  { I: ArrowUp, label: "Bring forward" },
  { I: SendToBackIcon, label: "Send to Back" },
  { I: BringToFrontIcon, label: "Bring to Front" },
];

type props = {
  canvasC: RefObject<CanvasC | null>;
};

function ShapeActions({ canvasC }: props) {
  const { activeObject, setFabricObject } = useCanvasStore();
  const isLocked = activeObject?.get("lockMovementX") || false;

  const check = () => {
    if (!canvasC || !activeObject) return false;
    return true;
  };

  return (
    <TooltipProvider>
      <div className="w-full flex flex-col gap-1 justify-center">
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  if (check()) {
                    canvasC.current?.duplicateCanvasObject();
                  }
                }}
                className="cursor-pointer"
              >
                <CopyIcon className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Duplicate</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  if (check()) {
                    canvasC.current?.deleteObject();
                  }
                }}
                className="cursor-pointer"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Deletel</TooltipContent>
          </Tooltip>

          <Tooltip>
            <Popover>
              <PopoverTrigger>
                <TooltipTrigger asChild>
                  <LucideBringToFront className="2-5 h-5" />
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className="w-fit h-fit">
                <TooltipProvider>
                  {index_options.map((o, i) => (
                    <Tooltip key={i}>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => {
                            if (check()) {
                              canvasC.current?.changeCanvasObjectIndexes(
                                activeObject,
                                (i + 1) as 1 | 2 | 3 | 4,
                              );
                            }
                          }}
                          size={"xs"}
                          variant={"outline"}
                        >
                          <o.I />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{o.label}</TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </PopoverContent>
            </Popover>
            <TooltipContent>Change Object index</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  if (!check()) return;
                  if (activeObject?.get("flipY")) {
                    canvasC.current?.changeCanvasProperties(activeObject, {
                      flipY: false,
                    });
                  } else {
                    canvasC.current?.changeCanvasProperties(
                      activeObject as FabricObject,
                      { flipY: true },
                    );
                  }
                  setFabricObject(activeObject);
                }}
              >
                <FlipVertical2 className="2-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Flip Vertical</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  if (!check()) return;
                  if (activeObject?.get("flipX")) {
                    canvasC.current?.changeCanvasProperties(activeObject, {
                      flipX: false,
                    });
                  } else {
                    canvasC.current?.changeCanvasProperties(
                      activeObject as FabricObject,
                      { flipX: true },
                    );
                  }
                }}
              >
                <FlipHorizontal2 className="2-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Flip Vertical</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`${isLocked && "bg-foreground/80 text-background p-1 rounded-md"}`}
                onClick={() => {
                  if (!check()) return;
                  const v = isLocked ? false : true;
                  canvasC.current?.changeCanvasProperties(
                    activeObject as FabricObject,
                    {
                      lockScalingY: v,
                      lockScalingX: v,
                      lockRotation: v,
                      lockMovementX: v,
                      lockMovementY: v,
                    },
                  );
                  setFabricObject(activeObject);
                }}
              >
                <LockIcon className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Lock Movement</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default ShapeActions;
