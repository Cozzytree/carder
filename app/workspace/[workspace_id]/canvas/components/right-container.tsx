import CanvasC from "../canvas";
import BtnWithColor from "./btn-with-color";
import InputWithValue from "./input-with-value";
import ColorOptions from "./which_option_items/color_options";
import OutlineAndShadow from "./which_option_items/outlineandShaodow";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ActiveSelection, Gradient, Group } from "fabric";
import { RefObject } from "react";
import { useCanvasStore } from "../store";
import { handleColorfill, handleGradient } from "../utilsfunc";
import ShapeActions from "./canvas_options/shape_actions";
import FontOptions from "./font_options";

type props = {
  canvasC: RefObject<CanvasC | null>;
};

function RightContainer({ canvasC }: props) {
  const { activeObject, setFabricObject } = useCanvasStore();

  const activeObjectFill =
    activeObject instanceof ActiveSelection || activeObject instanceof Group
      ? activeObject?.getObjects()[0].get("fill")
      : activeObject?.get("fill") || null;
  const activeObjectWidth =
    activeObject instanceof ActiveSelection || activeObject instanceof Group
      ? activeObject?.getObjects()[0].width
      : activeObject?.width || 0;
  const activeObjectHeight =
    activeObject instanceof ActiveSelection || activeObject instanceof Group
      ? activeObject?.getObjects()[0].height
      : activeObject?.height || 0;

  return (
    <div
      className={`${activeObject == null ? "text-foreground/20" : ""} overflow-y-auto pb-10 px-2 py-2 lg:w-[250px] xl:w-[350px] border-l border-l-foreground/50 p-2 bg-secondary`}
    >
      <div aria-disabled={activeObject == null} className="flex flex-col gap-1">
        <InputWithValue
          val={activeObject ? activeObject?.get("left") : 0}
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
          change={(e) => {
            if (!canvasC.current || !activeObject) return;
            canvasC.current.changeCanvasProperties(activeObject, { scaleX: e });
            activeObject.setCoords();
            setFabricObject(activeObject);
          }}
          val={
            activeObject instanceof ActiveSelection
              ? activeObject.getObjects()[0].get("scaleX")
              : activeObject?.get("scaleX") || 0
          }
        >
          <span> scale X</span>
        </InputWithValue>
        <InputWithValue
          change={(e) => {
            if (!canvasC.current || !activeObject) return;
            canvasC.current.changeCanvasProperties(activeObject, { scaleY: e });
            activeObject.setCoords();
            setFabricObject(activeObject);
          }}
          val={
            activeObject instanceof ActiveSelection
              ? activeObject.getObjects()[0].get("scaleY")
              : activeObject?.get("scaleY") || 0
          }
        >
          <span>scale Y</span>
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

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger>
              <BtnWithColor
                w={28}
                h={28}
                color={
                  activeObject instanceof ActiveSelection ||
                  activeObject instanceof Group
                    ? activeObject.getObjects()[0].get("fill")
                    : activeObject?.get("fill")
                }
              />
            </PopoverTrigger>
            <PopoverContent
              side="left"
              align="center"
              className="w-fit bg-secondary/90 border-foreground/20"
            >
              <ColorOptions
                showGradient
                showGradientOptions
                forCanvas={false}
                canvasC={canvasC}
                height={activeObjectWidth || 0}
                width={activeObjectHeight || 0}
                color={
                  activeObjectFill as string | Gradient<"linear" | "gradient">
                }
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
                    params: "fill",
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
          {(activeObject?.type == "textbox" ||
            activeObject?.type == "i-text") && (
            <FontOptions canvasC={canvasC} />
          )}
        </div>

        <OutlineAndShadow canvasC={canvasC} />

        <div className="w-full border border-foreground/30" />

        <div className="px-2 text-md">
          <h4 className="font-semibold">Actions</h4>
          <ShapeActions canvasC={canvasC} />
        </div>
      </div>
    </div>
  );
}

export default RightContainer;
