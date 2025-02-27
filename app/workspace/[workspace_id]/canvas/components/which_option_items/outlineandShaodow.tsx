import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import UpDown from "@/components/updown";
import { debouncer } from "@/lib/utils";
import {
  ActiveSelection,
  ColorStop,
  FabricObject,
  Gradient,
  Group,
  Shadow,
} from "fabric";
import { RefObject } from "react";
import CanvasC from "../../canvas";
import { useCanvasStore } from "../../store";
import ColorOptions from "./color_options";

type props = {
  canvasC: RefObject<CanvasC | null>;
};

function OutlineAndShadow({ canvasC }: props) {
  const { activeObject, setFabricObject } = useCanvasStore();
  let hasShadow: Shadow | null = null;
  let strokeWidth: number = 0;
  let stroke: string = "";

  if (
    activeObject instanceof ActiveSelection ||
    activeObject instanceof Group
  ) {
    const o = activeObject.getObjects()[0];
    strokeWidth = o.get("strokeWidth") as number;
    hasShadow = o.get("shadow");
    stroke = o.get("stroke");
  } else {
    stroke = activeObject?.get("stroke");
    strokeWidth = activeObject?.get("strokeWidth");
    hasShadow = activeObject?.get("shadow");
  }

  const shadow = new Shadow({
    blur: 4,
    offsetX: 3,
    offsetY: 2,
    color: "black",
    nonScaling: true,
  });

  const check = () => {
    if (!canvasC.current || !activeObject) return false;
    return true;
  };

  const handleToggleShadow = () => {
    if (!check()) return;
    const a = activeObject as FabricObject;
    if (hasShadow) {
      canvasC.current?.changeCanvasProperties(a, { shadow: null });
    } else canvasC.current?.changeCanvasProperties(a, { shadow: shadow });
    setFabricObject(activeObject);
  };

  const handleShadowOffset = (type: "X" | "Y", n: number) => {
    if (!check() || !hasShadow) return;
    if (type == "X") {
      hasShadow.offsetX = n;
      canvasC.current?.changeCanvasProperties(activeObject as FabricObject, {
        shadow: hasShadow,
      });
    } else {
      hasShadow.offsetY = n;
      canvasC.current?.changeCanvasProperties(activeObject as FabricObject, {
        shadow: hasShadow,
      });
    }
    setFabricObject(activeObject);
  };

  const handleStroke = (v: number) => {
    if (!check()) return;
    canvasC.current?.changeCanvasProperties(activeObject as FabricObject, {
      strokeWidth: v,
    });
    setFabricObject(activeObject);
  };

  return (
    <div className="flex gap-3 flex-col py-2 px-2">
      <div className="flex flex-col">
        <h4>Stroke</h4>
        <div className="flex items-center gap-1">
          {strokeWidth}
          <Slider
            defaultValue={[strokeWidth || 0]}
            max={50}
            step={2}
            min={0}
            onValueChange={debouncer((e: number[]) => {
              const v = e[0];
              if (isNaN(v)) return;
              handleStroke(v);
            }, 100)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="shrink-0 w-6 h-6 border border-foreground rounded-full"
                style={{
                  background: stroke,
                }}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <ColorOptions
                handleColor={(v) => {
                  if (!canvasC.current || !activeObject) return;
                  canvasC.current.changeCanvasProperties(activeObject, {
                    stroke: v,
                  });
                  setFabricObject(activeObject);
                }}
                handleGradient={(color) => {
                  if (!canvasC.current || !activeObject) return;
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
                  canvasC.current.changeCanvasProperties(activeObject, {
                    stroke: gradient,
                  });
                  setFabricObject(activeObject);
                }}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <label htmlFor="shadow" className="font-semibold text-lg">
            Drop Shadow
          </label>
          <Checkbox
            onCheckedChange={() => {
              handleToggleShadow();
            }}
            defaultChecked={hasShadow ? true : false}
            id="shadow"
          />
        </div>
        <div className="text-sm flex flex-col gap-2 mt-2">
          <div className="flex flex-col">
            <label>OffsetX</label>
            <UpDown
              onChange={(v) => {
                handleShadowOffset("X", v);
              }}
              disabled={!hasShadow}
              defaultV={hasShadow?.offsetX}
            />
          </div>

          <div className="flex flex-col">
            <label>OffsetY</label>
            <UpDown
              onChange={(v) => {
                handleShadowOffset("Y", v);
              }}
              disabled={!hasShadow}
              defaultV={hasShadow?.offsetY}
            />
          </div>

          <h4>Shadow Blur</h4>
          <Slider
            max={50}
            disabled={!hasShadow}
            defaultValue={[hasShadow?.blur || 0]}
            onValueChange={debouncer((e: number[]) => {
              if (!check() || !hasShadow) return;
              hasShadow.blur = e[0];
              canvasC.current?.changeCanvasProperties(
                activeObject as FabricObject,
                { shadow: hasShadow },
              );
              setFabricObject(activeObject);
            }, 50)}
          />

          <h4>Shadow Color</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                style={{ background: hasShadow?.color || "" }}
                className="w-6 h-6 rounded-full border"
              ></button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <ColorOptions
                handleColor={(v) => {
                  if (!check() || !hasShadow) return;
                  hasShadow.color = v;
                  canvasC.current?.changeCanvasProperties(
                    activeObject as FabricObject,
                    { shadow: hasShadow },
                  );
                }}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default OutlineAndShadow;
