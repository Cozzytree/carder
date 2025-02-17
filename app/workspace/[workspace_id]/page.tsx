"use client";
import * as fabric from "fabric";
import { useEffect, useRef } from "react";
import CanvasC from "./canvas/canvas";
import {
  DefaultCircle,
  DefaultIText,
  DefaultPath,
  DefaultRect,
} from "./canvas/default_styles";
import { useCanvasStore } from "./canvas/store";
import CanvasOptions from "./canvas/options";

export default function Page() {
  const { setFabricObject } = useCanvasStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasC_ref = useRef<CanvasC | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const f = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 700,
      preserveObjectStacking: true,
    });

    f.add(
      new DefaultRect({
        top: 50,
        left: 50,
        stroke: "black",
        strokeWidth: 2,
        rx: 10,
        ry: 10,
        width: 100,
        height: 100,
        fill: "transparent",
      }),
      new DefaultIText("Hello Seattle", {
        fontFamily: "Balsamiq Sans",
        fontSize: 15,
        top: 20,
        left: 20,
        width: 50,
        stroke: "black",
      }),
      new DefaultCircle({
        top: 50,
        left: 50,
        radius: 20,
        stroke: "black",
      }),
    );
    f.renderAll();
    canvasC_ref.current = new CanvasC({
      canvas: f,
      callbackSeleted: (e) => {
        setFabricObject(e);
      },
    });

    return () => {
      canvasC_ref.current?.clear();
    };
  }, []);

  useEffect(() => {
    if (!canvasC_ref.current) return;
  }, []);

  return (
    <div className="w-full min-h-screen flex justify-center items-center overflow-auto">
      <canvas
        ref={canvasRef}
        className="border border-foreground/10 rounded-md shadow-lg"
      />
      <CanvasOptions canvasC={canvasC_ref} />
    </div>
  );
}
