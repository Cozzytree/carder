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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCanvasStore } from "../../store";
import { Button } from "@/components/ui/button";
import { FabricObject } from "fabric";
import UpDown from "@/components/updown";
import { Slider } from "@/components/ui/slider";
import { debouncer } from "@/lib/utils";

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
      <div className="w-full flex flex-col gap-2 justify-center">
        <div className="flex gap-3">
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
                <CopyIcon />
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
                <TrashIcon />
              </button>
            </TooltipTrigger>
            <TooltipContent>Deletel</TooltipContent>
          </Tooltip>

          <Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <TooltipTrigger asChild>
                  <LucideBringToFront />
                </TooltipTrigger>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
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
              </DropdownMenuContent>
            </DropdownMenu>
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
                <FlipVertical2 />
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
                <FlipHorizontal2 />
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
                <LockIcon />
              </button>
            </TooltipTrigger>
            <TooltipContent>Lock Movement</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-full flex flex-col items-center justify-center">
          <div className="w-full flex items-center gap-2 justify-center">
            <span>w</span>
            <UpDown
              rate={activeObject?.type === "path" ? 0.1 : 10}
              defaultV={
                activeObject?.type === "path"
                  ? activeObject?.get("scaleX") || 0
                  : activeObject?.get("width") || 0
              }
              onChange={(v) => {
                if (!check()) return;
                const update =
                  activeObject?.type == "path" ? { scaleX: v } : { width: v };
                canvasC.current?.changeCanvasProperties(
                  activeObject as FabricObject,
                  update,
                );
                activeObject?.setCoords();
              }}
            />
          </div>

          <div className="w-full flex items-center gap-2 justify-center">
            <span>h</span>
            <UpDown
              rate={activeObject?.type === "path" ? 0.1 : 10}
              defaultV={
                activeObject?.type === "path"
                  ? activeObject?.get("scaleY") || 0
                  : activeObject?.get("height") || 0
              }
              onChange={(v) => {
                if (!check()) return;
                const update =
                  activeObject?.type == "path" ? { scaleY: v } : { height: v };
                canvasC.current?.changeCanvasProperties(
                  activeObject as FabricObject,
                  update,
                );
                activeObject?.setCoords();
              }}
            />
          </div>
        </div>

        <div className="w-full">
          <div className="flex gap-2 items-center">
            <span>ScaleX</span>
            <Slider
              max={10}
              step={0.1}
              min={0}
              defaultValue={[activeObject?.get("scaleX") || 0]}
              onValueChange={debouncer((e: number[]) => {
                if (!check()) return;
                canvasC.current?.changeCanvasProperties(
                  activeObject as FabricObject,
                  {
                    scaleX: e[0],
                  },
                );
                activeObject?.setCoords();
              }, 100)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <span>ScaleY</span>
            <Slider
              max={10}
              step={0.1}
              min={0}
              defaultValue={[activeObject?.get("scaleY") || 0]}
              onValueChange={debouncer((e: number[]) => {
                if (!check()) return;
                canvasC.current?.changeCanvasProperties(
                  activeObject as FabricObject,
                  {
                    scaleY: e[0],
                  },
                );
                activeObject?.setCoords();
              }, 100)}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default ShapeActions;
