"use client";
import * as fabric from "fabric";
import { MenuIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createApi } from "unsplash-js";
import CanvasC from "./canvas/canvas";
import { CanvasElements } from "./canvas/components/elements";
import WhichOContainer from "./canvas/components/which_option_container";
import ZoomContainer from "./canvas/components/zoom_container";
import { canvasConfig, saveOptions } from "./canvas/constants";
import CanvasOptions from "./canvas/options";
import { useCanvasStore, useWhichOptionsOpen } from "./canvas/store";
import { useIsMobile } from "./canvas/hooks/isMobile";
import OptionsMobile from "./canvas/options_mobile";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import RightContainer from "./canvas/components/right-container";

// const dbName = "carder_db";
// const db_version = 5;

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESSKEY || "",
});

const getPhotos = async () => {
  const p = await unsplash.photos.getRandom({
    count: 5,
    query: "design",
  });
  console.log(p);
};

export default function Page() {
  const width = useCanvasStore((state) => state.width);
  const height = useCanvasStore((state) => state.height);
  const setFabricObject = useCanvasStore((state) => state.setFabricObject);
  const setDrawingMode = useCanvasStore((state) => state.setDrawingMode);
  const containerScale = useCanvasStore((state) => state.containerScale);
  const setPointerEvents = useCanvasStore((state) => state.setPointerEvents);

  const { which } = useWhichOptionsOpen();
  const { isMobile } = useIsMobile();
  const [containerZoom, setContainerZoom] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasC_ref = useRef<CanvasC | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const innerContainerRef = useRef<HTMLDivElement | null>(null);

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
      selectionColor: "#20201810",
      selectionDashArray: [4, 4],
      selectionLineWidth: canvasConfig.selectionWidth,
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
          <Popover>
            <PopoverTrigger>
              <MenuIcon />
            </PopoverTrigger>
            <PopoverContent
              side="left"
              align="start"
              className="w-fit flex flex-col divide-y-2 p-2"
            >
              {saveOptions.map((o, i) => (
                <button
                  className="text-sm"
                  onClick={() => {
                    if (!canvasC_ref.current) return;
                    canvasC_ref.current.saveCanvasAs(o.t);
                  }}
                  key={i}
                >
                  {o.label}
                </button>
              ))}
              <button className="text-sm">
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
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="w-full h-full flex">
        {/* {left sidebar} */}
        <div className="h-full hidden md:flex relative">
          <div className="h-full flex flex-col items-center min-w-14 bg-secondary border-r-2">
            <CanvasElements canvasC={canvasC_ref} />
          </div>
          {which !== null && !isMobile && (
            <div className="h-full z-50">
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
                  width: `${containerZoom > 1 ? width + containerZoom * 1500 + "px" : "100%"}`,
                  height: `${containerZoom > 1 ? height + containerZoom * 1000 + "px" : "100%"}`,
                  // translate:
                  //   containerZoom > 1
                  //     ? `${(containerZoom - 1) * 200}px ${(containerZoom - 1) * 1000}px`
                  //     : "0px",
                }}
              >
                <canvas
                  ref={canvasRef}
                  className={`shrink-0 border border-foreground/10 rounded-md shadow-lg`}
                />
              </div>
            </div>
          </div>

          <div className="w-full z-50 min-h-14 flex items-center bg-secondary px-5">
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
    </div>
  );
}
