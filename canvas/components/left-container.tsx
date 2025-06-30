import CollapceWithBtn from "@/components/collapseWithBtn";
import { cn } from "@/lib/utils";
import { FabricObject } from "fabric";
import { useCanvasStore } from "../store";
import { useEffect, useState } from "react";
import { useEditorContext } from "./editor-wrapper";
import { EyeClosed, EyeIcon, PanelRightClose, PanelRightOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SaveCanvas from "./saveCanvas";
import UserAssets from "./user-assets";
import { useIsMobile } from "../hooks/isMobile";

export default function LeftContainer() {
  const isMobile = useIsMobile();
  const activeObject = useCanvasStore((state) => state.activeObject);

  const { showUploads, handleSideToggle, sidesOpen, canvas, sideWidth } = useEditorContext();
  const [objs, setObjs] = useState<FabricObject[] | []>(() => {
    return canvas?.current?.canvas?.getObjects() || [];
  });

  const handleActive = (o: FabricObject) => {
    if (!canvas.current) return;
    canvas.current.canvas.discardActiveObject();
    canvas.current.canvas.setActiveObject(o);
    canvas.current.canvas.requestRenderAll();
  };

  const handleVisible = (o: FabricObject) => {
    if (!canvas.current) return;
    const isV = o.get("visible");
    canvas.current.changeCanvasProperties(o, {
      visible: isV ? false : true,
    });
    if (isV) {
      canvas.current.canvas.discardActiveObject();
    } else {
      canvas.current.canvas.discardActiveObject();
      canvas.current.canvas.setActiveObject(o);
    }
  };

  useEffect(() => {
    setObjs(() => {
      return canvas?.current?.canvas?.getObjects() || [];
    });
  }, [activeObject, canvas]);

  return (
    <>
      {!sidesOpen ? (
        <div
          className={`fixed z-50 ${isMobile ? "bottom-4" : "top-4"} left-5 p-1 rounded-xs bg-muted border border-muted-foreground/40 shadow-md`}
        >
          <PanelRightOpen width={20} onClick={() => handleSideToggle(true)} />
        </div>
      ) : (
        <div
          style={{ width: sideWidth }}
          className={cn(
            "absolute lg:relative left-0 top-0 z-50",
            "h-full border-r-2 border-r-muted bg-muted py-4",
          )}
        >
          <div className="w-full flex justify-between px-3">
            <DropdownMenu>
              <DropdownMenuTrigger>Canvas</DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Save As</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <SaveCanvas />
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <PanelRightClose onClick={() => handleSideToggle(false)} />
          </div>

          <CollapceWithBtn label="Layers" classname="px-3 text-sm">
            {objs.map((o, i) => (
              <div
                key={i}
                className={cn(
                  activeObject?.get("id") === o?.get("id") && "bg-foreground/20",
                  "w-full rounded-l-md py-1 text-xs flex items-center justify-between px-4",
                )}
              >
                <button
                  // disabled={!activeObject?.get("visible")}
                  onClick={() => {
                    handleActive(o);
                  }}
                  className="w-full text-start"
                >
                  {o?.get("type")}
                </button>
                <button onClick={() => handleVisible(o)}>
                  {o.get("visible") ? (
                    <EyeIcon width={20} height={20} />
                  ) : (
                    <EyeClosed width={20} height={20} />
                  )}
                </button>
              </div>
            ))}
          </CollapceWithBtn>

          {showUploads && (
            <CollapceWithBtn label="Assets" classname="px-3">
              <UserAssets
                onChange={(e) => {
                  canvas?.current?.createNewImage(e);
                }}
              />
            </CollapceWithBtn>
          )}
        </div>
      )}
    </>
  );
}
