import { RefObject } from "react";
import CanvasC from "../../canvas";
import UpDown from "@/components/updown";
import { useCanvasStore } from "../../store";

type props = {
  canvasC: RefObject<CanvasC | null>;
};
function ResizeCanvas({ canvasC }: props) {
  const setWidth = useCanvasStore((state) => state.setWidth);
  const setHeight = useCanvasStore((state) => state.setHeight);
  const width = useCanvasStore((state) => state.width);
  const height = useCanvasStore((state) => state.height);
  return (
    <div
      className={`w-full px-2 flex flex-col justify-center items-center gap-2`}
    >
      <div className="w-full flex flex-col">
        <span className="text-sm">width</span>
        <UpDown
          defaultV={width}
          onChange={(v) => {
            setWidth(v);
          }}
        />
      </div>

      <div className="w-full flex flex-col">
        <span className="text-sm">height</span>
        <UpDown
          defaultV={height}
          onChange={(v) => {
            setHeight(v);
          }}
        />
      </div>
    </div>
  );
}

export default ResizeCanvas;
