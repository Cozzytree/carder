import { ColorStop, Gradient } from "fabric";
import { ChevronLeft } from "lucide-react";
import { RefObject, useEffect } from "react";
import CanvasC from "../canvas";
import { useCanvasStore, useWhichOptionsOpen } from "../store";
import { canvasShapes, textTypes, WhichOptionEmum } from "../types";
import ColorOptions from "./which_option_items/color_options";
import FontOptions from "./which_option_items/fonts_option(big)";
import OutlineAndShadow from "./which_option_items/outlineandShaodow";
import ResizeCanvas from "./which_option_items/resize_canvas";
import Shapes from "./which_option_items/shapes";
import TextOptions from "./which_option_items/texts_o";
import ImageOption from "./image_option";

type props = {
  canvasC: RefObject<CanvasC | null>;
};

function WhichOContainer({ canvasC }: props) {
  const { activeObject, setFabricObject } = useCanvasStore();
  const { setWhichOption, which } = useWhichOptionsOpen();

  const handleCreateShape = (type: canvasShapes, path?: string) => {
    if (!canvasC.current) return;
    canvasC.current.createNewShape({ shapetype: type, path });
  };

  const handleNewText = (type: textTypes) => {
    if (!canvasC.current) return;
    canvasC.current.createText(type);
  };

  const handleObjProperty = (property: string, v: any) => {
    if (!canvasC.current) return;
    if (!activeObject) {
      canvasC.current.changeCanvasColor(v);
    } else {
      canvasC.current.changeCanvasProperties(activeObject, property, v);
    }
    setFabricObject(activeObject);
  };
  const handleGradient = (property: string, color: string[]) => {
    if (!canvasC.current) return;
    if (activeObject) {
      const divide = 1 / (color.length - 1);
      const stops: ColorStop[] = color.map((c, i) => ({
        color: c,
        offset: divide * i,
      }));
      const gradient = new Gradient({
        coords: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: activeObject.height,
        },
        type: "linear",
        colorStops: stops,
      });
      canvasC.current.changeCanvasProperties(activeObject, property, gradient);
    } else {
      const gradient = new Gradient({
        coords: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: canvasC.current.canvas.height,
        },
        type: "linear",
        colorStops: color.map((c) => ({ color: c, offset: Math.random() })),
      });
      canvasC.current.changeCanvasColor(gradient);
    }
    setFabricObject(activeObject);
  };

  useEffect(() => {
    if (
      !activeObject &&
      which !== "images" &&
      which !== "shapes" &&
      which !== "text" &&
      which !== "resize_canvas"
    ) {
      setWhichOption("color");
    }
  }, [activeObject, which]);

  return (
    <div className="w-[250px] bg-secondary border-r-2 relative">
      <h3 className="capitalize px-2 py-1 font-semibold">{which}</h3>

      {which === WhichOptionEmum.IMAGE && <ImageOption canvasC={canvasC} />}

      {which === WhichOptionEmum.SHAPE && (
        <Shapes handleShape={handleCreateShape} />
      )}
      {which === WhichOptionEmum.TEXT && (
        <TextOptions handleNewText={handleNewText} />
      )}

      {which === WhichOptionEmum.COLOR && (
        <ColorOptions
          handleGradient={(g) => {
            handleGradient("fill", g);
          }}
          handleColor={(v) => {
            handleObjProperty("fill", v);
          }}
        />
      )}

      {which === WhichOptionEmum.RESIZE_CANVAS && (
        <ResizeCanvas canvasC={canvasC} />
      )}

      {which === WhichOptionEmum.OUTLINE && (
        <OutlineAndShadow canvasC={canvasC} />
      )}

      {which === WhichOptionEmum.FONTS && <FontOptions canvasC={canvasC} />}

      <button className="border-2 rounded-full border-foreground/30 bg-secondary z-50 absolute -right-4 top-1/2 -translate-y-1/2">
        <ChevronLeft
          onClick={() => {
            setWhichOption(null);
          }}
        />
      </button>
    </div>
  );
}

export default WhichOContainer;
