import { ChangeEvent, RefObject } from "react";
import { useCanvasStore } from "../../store";
import CanvasC from "../../canvas";
import { debouncer } from "@/lib/utils";

type props = {
  canvasC: RefObject<CanvasC | null>;
};
function ResizeCanvas({ canvasC }: props) {
  const { width, height, setWidth, setHeight } = useCanvasStore();
  return (
    <div className="w-full px-2 flex flex-col justify-center">
      <div>
        <span>Width </span>
        <div className="flex items-end gap-1">
          <input
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
      <div>
        <span>Height</span>
        <div className="flex items-end gap-1">
          <input
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
