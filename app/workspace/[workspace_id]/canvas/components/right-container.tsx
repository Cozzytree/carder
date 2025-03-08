import CanvasC from "../canvas";
import BtnWithColor from "./btn-with-color";
import InputWithValue from "./input-with-value";
import OpacityOption from "./opacity_option";
import ColorOptions from "./which_option_items/color_options";
import OutlineAndShadow from "./which_option_items/outlineandShaodow";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ActiveSelection } from "fabric";
import { RefObject } from "react";
import { useCanvasStore } from "../store";
import { handleColorfill, handleGradient } from "../utilsfunc";

type props = {
  canvasC: RefObject<CanvasC | null>;
};

function RightContainer({ canvasC }: props) {
  const { activeObject, setFabricObject } = useCanvasStore();

  return (
    <div
      className={`${activeObject == null ? "opacity-50" : " bg-secondary"} lg:w-[200px] xl:w-[250px] border border-l-foreground/40 p-2`}
    >
      <div aria-disabled={activeObject == null} className="flex flex-col gap-2">
        <InputWithValue
          val={activeObject?.get("left") || 0}
          change={(e) => {
            if (!canvasC.current || !activeObject) return;
            canvasC.current.changeCanvasProperties(activeObject, {
              left: e,
            });
            activeObject?.setCoords();
            setFabricObject(activeObject);
          }}
        >
          <span>x-axis</span>
        </InputWithValue>
        <InputWithValue
          val={activeObject?.get("top") || 0}
          change={(e) => {
            if (!canvasC.current || !activeObject) return;

            canvasC.current.changeCanvasProperties(activeObject, {
              top: e,
            });
            activeObject.setCoords();
            setFabricObject(activeObject);
          }}
        >
          <span>y-axis</span>
        </InputWithValue>
        <InputWithValue
          val={activeObject?.get("angle") || 0}
          change={(e) => {
            if (!canvasC.current || !activeObject) return;
            canvasC.current.changeCanvasProperties(activeObject, {
              angle: e,
            });
            activeObject.setCoords();
            setFabricObject(activeObject);
          }}
        >
          <span>angle</span>
        </InputWithValue>
        <InputWithValue
          val={
            activeObject instanceof ActiveSelection
              ? activeObject.getObjects()[0].get("width") || 0
              : activeObject?.get("width") || 0
          }
          change={(e) => {
            if (!canvasC.current || !activeObject) return;

            canvasC.current.changeCanvasProperties(activeObject, {
              width: e,
            });
            activeObject.setCoords();
            setFabricObject(activeObject);
          }}
        >
          <span>width</span>
        </InputWithValue>
        <InputWithValue
          val={
            activeObject instanceof ActiveSelection
              ? activeObject.getObjects()[0].get("height") || 0
              : activeObject?.get("height") || 0
          }
          change={(e) => {
            if (!canvasC.current || !activeObject) return;
            canvasC.current.changeCanvasProperties(activeObject, {
              height: e,
            });
            activeObject.setCoords();
            setFabricObject(activeObject);
          }}
        >
          <span>height</span>
        </InputWithValue>

        <OpacityOption
          fn={(v) => {
            if (!canvasC.current || !activeObject) return;
            canvasC.current.changeCanvasProperties(activeObject, {
              opacity: v,
            });
          }}
          opacity={activeObject?.get("opacity") || 1}
        />

        <div className="flex flex-col items-start">
          <Popover>
            <PopoverTrigger>
              <BtnWithColor color={activeObject?.get("fill")} />
            </PopoverTrigger>
            <PopoverContent side="left" align="start">
              <ColorOptions
                handleColor={(v) => {
                  handleColorfill({
                    activeObject: activeObject,
                    canvasC: canvasC,
                    color: v,
                    fn: () => {
                      setFabricObject(activeObject);
                    },
                  });
                }}
                handleGradient={(c, t) => {
                  if (!activeObject) return;
                  handleGradient({
                    type: t ? t : "linear",
                    activeObject: activeObject,
                    canvasC: canvasC,
                    color: c,
                    fn: () => {
                      setFabricObject(activeObject);
                    },
                  });
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <OutlineAndShadow canvasC={canvasC} />
      </div>
    </div>
  );
}

export default RightContainer;
