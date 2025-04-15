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
  GroupIcon,
  LockIcon,
  LucideBringToFront,
  LucideIcon,
  SendToBackIcon,
  TrashIcon,
  UngroupIcon,
} from "lucide-react";
import { useCanvasStore } from "../../store";
import { Button } from "@/components/ui/button";
import { ActiveSelection, FabricObject, Group } from "fabric";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "../../hooks/isMobile";

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
  const { isMobile } = useIsMobile();
  const { activeObject, setFabricObject } = useCanvasStore();
  const isLocked = activeObject?.get("lockMovementX") || false;
  const enableGroup = activeObject instanceof ActiveSelection ? true : false;
  const discardGroup =
    !(activeObject instanceof ActiveSelection) &&
    activeObject instanceof Group &&
    activeObject?.get("bubble") == undefined;

  const check = () => {
    if (!canvasC || !activeObject) return false;
    return true;
  };

  return (
    <TooltipProvider>
      <div className="w-full flex flex-col gap-1 justify-center">
        <div
          className={`${!isMobile ? "grid grid-cols-4" : "flex items-center gap-1"}`}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"simple"}
                size={"xs"}
                onClick={() => {
                  if (check()) {
                    canvasC.current?.duplicateCanvasObject();
                  }
                }}
                className="cursor-pointer"
              >
                <CopyIcon className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Duplicate</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"simple"}
                size={"xs"}
                onClick={() => {
                  if (check()) {
                    canvasC.current?.deleteObject();
                  }
                }}
                className="cursor-pointer"
              >
                <TrashIcon className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Deletel</TooltipContent>
          </Tooltip>

          <Tooltip>
            <Popover>
              <PopoverTrigger>
                <TooltipTrigger asChild>
                  <Button variant={"simple"} size={"xs"}>
                    <LucideBringToFront className="2-5 h-5" />
                  </Button>
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
                          variant={"simple"}
                          size={"xs"}
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
              <Button
                variant={"simple"}
                size={"xs"}
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
              </Button>
            </TooltipTrigger>
            <TooltipContent>Flip Vertical</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"simple"}
                size={"xs"}
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
              </Button>
            </TooltipTrigger>
            <TooltipContent>Flip Vertical</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"simple"}
                size={"xs"}
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
              </Button>
            </TooltipTrigger>
            <TooltipContent>Lock Movement</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  if (!canvasC.current || !activeObject) return;
                  canvasC.current.createNewGroup(activeObject);
                }}
                disabled={!enableGroup}
                variant={"simple"}
                size={"xs"}
              >
                <GroupIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Group</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  if (!canvasC.current || !activeObject) return;
                  canvasC.current.removeGroup(activeObject);
                }}
                disabled={!discardGroup}
                variant={"simple"}
                size={"xs"}
              >
                <UngroupIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Group</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default ShapeActions;
