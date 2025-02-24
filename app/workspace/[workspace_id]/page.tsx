"use client";
import * as fabric from "fabric";
import { useEffect, useRef, useState } from "react";
import CanvasC from "./canvas/canvas";
import {
  DefaultCircle,
  DefaultCustomPath,
  DefaultIText,
  DefaultLine,
  DefaultRect,
} from "./canvas/default_styles";
import { useCanvasStore, useWhichOptionsOpen } from "./canvas/store";
import CanvasOptions from "./canvas/options";
import { CanvasElements } from "./canvas/components/elements";
import { Slider } from "@/components/ui/slider";
import WhichOContainer from "./canvas/components/which_option_container";

const dbName = "carder_db";
const db_version = 5;

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
  const [containerZoom, setContainerZoom] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasC_ref = useRef<CanvasC | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
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
  //       console.log(e);
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
      <div className="w-full border-b-2 min-h-10">Home</div>
      <div className="w-ful h-full flex">
        {/* {left sidebar} */}
        <div className="h-full hidden md:flex">
          <div className="h-full flex flex-col items-center min-w-20 bg-secondary border-r-2">
            <CanvasElements canvasC={canvasC_ref} />
          </div>
          {which !== null && <WhichOContainer canvasC={canvasC_ref} />}
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
                className="w-full h-full absolute top-0 left-0 flex justify-center items-center px-5"
                style={{
                  translate:
                    containerZoom > 1
                      ? `${(containerZoom - 1) * 200}px ${(containerZoom - 1) * 100}px`
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

          <div className="min-h-14 flex items-center bg-secondary">
            <div className="w-48 flex items-center gap-1">
              <span className="text-nowrap">
                {(containerZoom * 100).toFixed(0)} %
              </span>
              <Slider
                defaultValue={[containerZoom * 100]}
                onValueChange={(e) => {
                  const v = Number(e[0]);
                  if (containerRef.current) {
                    setContainerZoom(v / 100);
                    containerRef.current.style.scale = `${v / 100}`;
                  }
                }}
                min={20}
                step={5}
                max={300}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
