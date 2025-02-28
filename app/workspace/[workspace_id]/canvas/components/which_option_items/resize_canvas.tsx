import { ChangeEvent, RefObject } from "react";
import { useCanvasStore } from "../../store";
import CanvasC from "../../canvas";
import { debouncer } from "@/lib/utils";
import { useIsMobile } from "../../hooks/isMobile";

type props = {
  canvasC: RefObject<CanvasC | null>;
};
function ResizeCanvas({ canvasC }: props) {
  const { isMobile } = useIsMobile();
  const { width, height, setWidth, setHeight } = useCanvasStore();
  return (
    <div
      className={`w-fit px-2 flex ${isMobile ? "flex-row" : "flex-col"} justify-center gap-2`}
    >
      <div className={`${isMobile && "flex items-center"}`}>
        <span>{isMobile ? "w" : "Width"} </span>
        <div className="flex items-end gap-1">
          <input
            className={`${isMobile ? "w-16" : "w-full"} px-2`}
            type="number"
            defaultValue={width}
            // onChange={(e) => {}}
            onChange={debouncer((e: ChangeEvent<HTMLInputElement>) => {
              if (!canvasC.current) return;
              const v = +e.target.value;
              setWidth(v);
              canvasC.current.changeCanvasSize("width", v);
            }, 10)}
          />
          <span>px</span>
        </div>
      </div>
      <div className={`${isMobile && "flex items-center"}`}>
        <span>{isMobile ? "h" : "Height"} </span>
        <div className="flex items-end gap-1">
          <input
            className={`${isMobile ? "w-16" : "w-full"} px-2`}
            onChange={debouncer((e: ChangeEvent<HTMLInputElement>) => {
              if (!canvasC.current) return;
              const v = +e.target.value;
              setHeight(v);
              canvasC.current.changeCanvasSize("height", v);
            }, 10)}
            type="number"
            defaultValue={height}
          />{" "}
          <span>px</span>
        </div>
      </div>
    </div>
  );
}

export default ResizeCanvas;
