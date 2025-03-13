"use client";

import * as fabric from "fabric";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MenuIcon } from "lucide-react";
import { canvasConfig, saveOptions } from "../constants";
import CanvasC from "../canvas";
import { useEffect, useRef } from "react";
import CanvasEditor from "./CanvasEditor";
import { useCanvasStore } from "../store";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

// type props = {
//   userSession?: Session | null;
// };

function EditorWrapper() {
  const width = useCanvasStore((state) => state.width);
  const snap = useCanvasStore((state) => state.snapping);
  const height = useCanvasStore((state) => state.height);
  const setFabricObject = useCanvasStore((state) => state.setFabricObject);
  const setDrawingMode = useCanvasStore((state) => state.setDrawingMode);
  const setPointerEvents = useCanvasStore((state) => state.setPointerEvents);

  const canvasC_ref = useRef<CanvasC | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
      snapping: snap,
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

  return (
    <>
      <div className="w-full bg-secondary flex justify-between items-center border-b min-h-10 px-5 border-b-foreground/60 py-2">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
        </div>
        <div>
          <Popover>
            <PopoverTrigger>
              <MenuIcon />
            </PopoverTrigger>
            <PopoverContent
              side="left"
              align="start"
              className="w-fit flex flex-col p-0"
            >
              {saveOptions.map((o, i) => (
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="p-3"
                  onClick={() => {
                    if (!canvasC_ref.current) return;
                    canvasC_ref.current.saveCanvasAs(o.t);
                  }}
                  key={i}
                >
                  {o.label}
                </Button>
              ))}
              <Button variant={"ghost"} size={"sm"} className="p-3">
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
              </Button>
              <Button variant={"ghost"} size={"sm"} className="p-3">
                <span>Theme</span>
                <ModeToggle />
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <CanvasEditor canvasC_ref={canvasC_ref} canvasRef={canvasRef} />
    </>
  );
}
export default EditorWrapper;
