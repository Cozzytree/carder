import { RefObject, useEffect, useRef, useState } from "react";
import CanvasC from "@/app/workspace/[workspace_id]/canvas/canvas";
import { useIsMobile } from "../hooks/isMobile";
import {
  useCanvasStore,
  useWhichOptionsOpen,
} from "@/app/workspace/[workspace_id]/canvas/store";
import { CanvasElements } from "./elements";
import WhichOContainer from "./which_option_container";
import CanvasOptions from "../options";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import ZoomContainer from "./zoom_container";
import OptionsMobile from "../options_mobile";
import RightContainer from "./right-container";

type props = {
  canvasC_ref: RefObject<CanvasC | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

function CanvasEditor({ canvasC_ref, canvasRef }: props) {
  const width = useCanvasStore((state) => state.width);
  const snap = useCanvasStore((state) => state.snapping);
  const setSnap = useCanvasStore((state) => state.setSnap);
  const height = useCanvasStore((state) => state.height);
  const containerScale = useCanvasStore((state) => state.containerScale);

  const { which } = useWhichOptionsOpen();
  const { isMobile } = useIsMobile();
  const [containerZoom, setContainerZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const innerContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = () => {
      if (!canvasRef.current) return;
      if (innerContainerRef.current) {
        innerContainerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    };
    handler();
  }, [containerZoom]);

  return (
    <div className="w-full h-full flex">
      {/* {left sidebar} */}
      <div
        className={`h-full border-r border-r-foreground/50 ${isMobile ? "hidden" : "flex"}`}
      >
        <div className="h-full flex flex-col items-center border">
          <CanvasElements canvasC={canvasC_ref} />
        </div>
        {which !== null && !isMobile && (
          <div className="h-full z-50 border-l border-l-foreground/50">
            <WhichOContainer canvasC={canvasC_ref} />
          </div>
        )}
      </div>

      <div className="w-full h-full flex flex-col">
        <div>
          <CanvasOptions
            containerZoom={containerZoom}
            setContainerZoom={setContainerZoom}
            canvasC={canvasC_ref}
            containerRef={containerRef}
          />
        </div>

        {/* {canvas container} */}
        <div className="w-full h-full flex justify-center overflow-auto">
          <div
            ref={containerRef}
            style={{
              scale: containerScale,
            }}
            className="shrink-0 w-full flex justify-center items-center py-5 h-full relative"
          >
            <div
              ref={innerContainerRef}
              className="absolute top-0 left-0 flex justify-center items-center"
              style={{
                width: `${width + containerZoom * 500 + "px"}`,
                height: `${height + containerZoom * 250 + "px"}`,
              }}
            >
              <ContextMenu>
                <ContextMenuTrigger>
                  <canvas
                    ref={canvasRef}
                    className={`shrink-0 border border-foreground/10 rounded-md shadow-lg`}
                  />
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem
                    onClick={() => {
                      if (!canvasC_ref.current) return;
                      canvasC_ref.current.snapping = canvasC_ref.current
                        .snapping
                        ? false
                        : true;
                      setSnap(canvasC_ref.current.snapping);
                    }}
                  >
                    {snap ? "Disable " : "Enable "}
                    snapping
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-t-foreground/50 z-50 min-h-14 flex items-center px-5">
          {/* {!isMobile && activeObject && ( */}
          <div className="flex items-center gap-1">
            <ZoomContainer
              containerRef={containerRef}
              handleZoom={(v) => {
                setContainerZoom(v);
              }}
              zoomLevel={containerZoom}
            />
          </div>
          {isMobile && <OptionsMobile canvasC={canvasC_ref} />}
        </div>
      </div>

      {/* {right container} */}
      {!isMobile && <RightContainer canvasC={canvasC_ref} />}
    </div>
  );
}

export default CanvasEditor;
