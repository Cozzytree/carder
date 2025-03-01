import { ChangeEvent, RefObject } from "react";
import { useCanvasStore } from "../../store";
import CanvasC from "../../canvas";
import { debouncer } from "@/lib/utils";
import { useIsMobile } from "../../hooks/isMobile";
import UpDown from "@/components/updown";

type props = {
  canvasC: RefObject<CanvasC | null>;
};
function ResizeCanvas({ canvasC }: props) {
  const { width, height, setWidth, setHeight } = useCanvasStore();
  return (
    <div
      className={`w-full px-2 flex flex-col justify-center items-center gap-2`}
    >
      <div className="w-full flex flex-col">
        <span>width</span>
        <UpDown
          defaultV={width}
          onChange={(v) => {
            setWidth(v);
          }}
        />
      </div>

      <div className="w-full flex flex-col">
        <span>height</span>
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
