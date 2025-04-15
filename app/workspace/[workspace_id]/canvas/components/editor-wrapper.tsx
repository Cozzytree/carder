"use client";

import * as fabric from "fabric";
import CanvasC from "../canvas";
import CanvasEditor from "./CanvasEditor";

import type { DBshape } from "@/lib/types";
import React, { useEffect, useRef } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MenuIcon } from "lucide-react";
import { canvasConfig, saveOptions } from "../constants";
import { useCanvasStore } from "../store";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { action } from "@/lib/queueShapes";
import {
  DefaultCustomPath,
  DefaultIText,
  DefaultRect,
} from "../default_styles";

type props = {
  children?: React.ReactNode;
  initialData?: { shapes: DBshape[]; width: number; height: number };
  onChange: (
    params:
      | fabric.FabricObject
      | { width: number; height: number; background: string },
    action: action,
  ) => void;
  idPrefix?: string;
};

function EditorWrapper({ initialData, onChange, children, idPrefix }: props) {
  const { theme } = useTheme();
  const width = useCanvasStore((state) => state.width);
  const setWidth = useCanvasStore((state) => state.setWidth);
  const setHeight = useCanvasStore((state) => state.setHeight);
  const snap = useCanvasStore((state) => state.snapping);
  const height = useCanvasStore((state) => state.height);
  const setFabricObject = useCanvasStore((state) => state.setFabricObject);
  const setDrawingMode = useCanvasStore((state) => state.setDrawingMode);
  const setPointerEvents = useCanvasStore((state) => state.setPointerEvents);

  const canvasC_ref = useRef<CanvasC | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (initialData) {
      setWidth(initialData.width);
      setHeight(initialData.height);
    }

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

    if (initialData?.shapes) {
      initialData.shapes.forEach((shape) => {
        const props = JSON.parse(shape.props) as fabric.FabricObject;
        let s: fabric.FabricObject | null = null;
        if (props.type === "Rect") {
          s = new DefaultRect(props, shape._id);
        } else if (props.type === "Path") {
          const pathProps = props as fabric.Path;
          let fullPath = "";
          const { path, ...restProps } = pathProps;

          path.forEach((p) => {
            const lp = p.join(" ");
            fullPath += lp + " ";
          });

          s = new DefaultCustomPath(
            fullPath,
            {
              fill: restProps.fill,
              stroke: restProps.stroke,
              strokeWidth: restProps.strokeWidth,
              shadow: restProps.shadow,
              scaleX: restProps.scaleX,
              scaleY: restProps.scaleY,
              width: restProps.width,
              height: restProps.height,
              top: restProps.top,
              left: restProps.left,
            },
            shape._id,
          );
        } else if (props.type === "Textbox" || props.type === "I-Text") {
          const textProp = props as fabric.Textbox;
          s = new DefaultIText(textProp.text, {
            top: textProp.top,
            left: textProp.left,
            width: textProp.width,
            height: textProp.height,
            fontStyle: textProp.fontStyle,
            fontFamily: textProp.fontFamily,
            fill: textProp.fill,
            stroke: textProp.stroke,
            scaleX: textProp.scaleX,
            scaleY: textProp.scaleY,
            opacity: textProp.opacity,
            fontSize: textProp.fontSize,
            fontWeight: textProp.fontWeight,
          });
        }
        if (s && f) {
          f.add(s);
          f.renderAll();
        }
      });
    }

    f.renderAll();
    canvasC_ref.current = new CanvasC({
      theme,
      snapping: snap,
      canvas: f,
      onCreation: (e) => {
        onChange?.(e, "create");
      },
      onUpdate: (e) => {
        onChange(e, "update");
      },
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
      idPrefix,
    });

    return () => {
      canvasC_ref.current?.clear();
    };
  }, [theme]);

  useEffect(() => {
    if (!canvasC_ref.current) return;
    canvasC_ref.current.changeCanvasSize("width", width);
    canvasC_ref.current.changeCanvasSize("height", height);
    onChange(
      {
        width: width,
        height: height,
        background: canvasC_ref.current.canvas.backgroundColor.toString(),
      },
      "resize",
    );
  }, [width, height]);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="w-full flex justify-between items-center border-b min-h-10 px-5 border-b-foreground/60 py-2">
        <div className="">{children}</div>
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
                  variant={"outline"}
                  size={"xs"}
                  className="p-2 rounded-none"
                  onClick={() => {
                    if (!canvasC_ref.current) return;
                    canvasC_ref.current.saveCanvasAs(o.t);
                  }}
                  key={i}
                >
                  {o.label}
                </Button>
              ))}
              <Button
                variant={"outline"}
                size={"xs"}
                className="p-2 rounded-none"
              >
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"outline"}
                    size={"xs"}
                    className="p-2 rounded-none"
                  >
                    <span>Theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <ModeToggle />
                </DropdownMenuContent>
              </DropdownMenu>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <CanvasEditor canvasC_ref={canvasC_ref} canvasRef={canvasRef} />
    </div>
  );
}
export default EditorWrapper;
