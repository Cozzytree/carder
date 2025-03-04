"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as fabric from "fabric";
import { SaveIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createApi } from "unsplash-js";
import CanvasC from "./canvas/canvas";
import { CanvasElements } from "./canvas/components/elements";
import WhichOContainer from "./canvas/components/which_option_container";
import ZoomContainer from "./canvas/components/zoom_container";
import { saveOptions } from "./canvas/constants";
import CanvasOptions from "./canvas/options";
import { useCanvasStore, useWhichOptionsOpen } from "./canvas/store";
import { useIsMobile } from "./canvas/hooks/isMobile";
import OptionsMobile from "./canvas/options_mobile";

// const dbName = "carder_db";
// const db_version = 5;

const unsplash = createApi({
  accessKey: "WBZ8WCzpqldyqwgR6ZwdUiUZqKwcoUs_TuBwMtzOGgI",
});

const getPhotos = async () => {
  const p = await unsplash.photos.getRandom({
    count: 5,
    query: "design",
  });
  console.log(p);
};

export default function Page() {
  const {
    setFabricObject,
    width,
    height,
    setDrawingMode,
    containerScale,
    setPointerEvents,
  } = useCanvasStore();
  const { which } = useWhichOptionsOpen();
  const { isMobile } = useIsMobile();
  const [containerZoom, setContainerZoom] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasC_ref = useRef<CanvasC | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      fabric.setFilterBackend(new fabric.WebGLFilterBackend());
    } catch (err) {
      console.error(err);
      fabric.setFilterBackend(new fabric.Canvas2dFilterBackend());
    }

    fabric.initFilterBackend();

    const f = new fabric.Canvas(canvasRef.current, {
      width: width,
      height: height,
      preserveObjectStacking: true,
      uniScaleKey: "altKey",
      uniformScaling: true,
      selectionColor: "#2030ff20",
      selectionDashArray: [4, 4],
      selectionLineWidth: 2,
      allowTouchScrolling: true,
    });
    f.renderAll();
    canvasC_ref.current = new CanvasC({
      canvas: f,
      callbackSeleted: (e) => {
        setFabricObject(e);
      },
      callbackDrawMode: (v) => {
        setDrawingMode(v);
      },
      canvasElement: canvasRef.current,
      changePointerEventsForCanvas: (v) => {
        setPointerEvents(v);
      },
    });

    return () => {
      canvasC_ref.current?.clear();
    };
  }, []);

  useEffect(() => {
    if (!canvasC_ref.current) return;
    canvasC_ref.current.changeCanvasSize("width", width);
    canvasC_ref.current.changeCanvasSize("height", height);
  }, [width, height]);

  useEffect(() => {
    const handler = () => {
      if (!canvasRef.current) return;
      if (containerRef.current) {
        containerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }

      if (window.innerWidth <= 480) {
        canvasRef.current.style.pointerEvents = "none";
      } else {
        canvasRef.current.style.pointerEvents = "auto";
      }
    };
    handler();
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  // useEffect(() => {
  //    const res = indexedDB.open(dbName, db_version);
  //    res.onsuccess = (e) => {
  //    };
  //    res.onupgradeneeded = (e) => {
  //       const dbInstance = (e.target as IDBRequest).result;
  //       if (!dbInstance.objectStoreNames.contains(dbName)) {
  //          dbInstance.createObjectStore(dbName, { keyPath: "id" });
  //       }
  //    };
  // }, []);

  return (
    <div className="w-full overflow-hidden h-screen flex flex-col">
      <div className="w-full flex justify-between items-center border-b-2 min-h-10 px-5">
        <div>LOGO</div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <label htmlFor="loadfromfile">Load from File</label>
                  <input
                    className="hidden"
                    onChange={async (e) => {
                      if (e.target.files) {
                        if (!canvasC_ref.current) return;
                        e.target.files[0].text().then(async (d) => {
                          await canvasC_ref.current?.loadFromFile(d);
                        });
                      }
                    }}
                    type="file"
                    id="loadfromfile"
                    accept=".json"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>Load from file</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger>
                    <SaveIcon />
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Save As</TooltipContent>
              </Tooltip>
              <DropdownMenuContent>
                {saveOptions.map((o, i) => (
                  <DropdownMenuItem
                    onClick={() => {
                      if (!canvasC_ref.current) return;
                      canvasC_ref.current.saveCanvasAs(o.t);
                    }}
                    key={i}
                  >
                    {o.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        </div>
      </div>
      <div className="w-ful h-full flex">
        {/* {left sidebar} */}
        <div className="h-full hidden md:flex">
          <div className="h-full flex flex-col items-center min-w-20 bg-secondary border-r-2">
            <CanvasElements canvasC={canvasC_ref} />
          </div>
          {which !== null && !isMobile && (
            <WhichOContainer canvasC={canvasC_ref} />
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
              className="shrink-0 w-full h-full relative"
            >
              <div
                className="w-full h-full absolute top-0 left-0 flex justify-center items-center px-5 my-10"
                style={{
                  translate:
                    containerZoom > 1
                      ? `${(containerZoom - 1) * 200}px ${(containerZoom - 1) * 1000}px`
                      : "0px",
                }}
              >
                <canvas
                  ref={canvasRef}
                  className={`shrink-0 border border-foreground/10 rounded-md shadow-lg`}
                />
              </div>
            </div>
          </div>

          <div className="w-full min-h-14 flex items-center bg-secondary px-5">
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
      </div>
    </div>
  );
}
