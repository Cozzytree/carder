import { filtersOptions } from "../constants";
import { RefObject, useState } from "react";
import CanvasC from "../canvas";
import { useCanvasStore } from "../store";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FabricImage, FabricObject, filters } from "fabric";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { debouncer } from "@/lib/utils";
import Gamma from "./color_filters.tsx/gamma";
import Brightness from "./color_filters.tsx/brightness";
import ContrastOption from "./color_filters.tsx/contrast";
import Vibrance from "./color_filters.tsx/vibrance";
import BlurFilter from "./color_filters.tsx/blur";
import Saturation from "./color_filters.tsx/saturation";
import RemoveColor from "./color_filters.tsx/remove_color";
import PixelateFilter from "./color_filters.tsx/pixelate";
import NoiseFilter from "./color_filters.tsx/noise_filter";
import HueFilter from "./color_filters.tsx/hue_filter";
import BlendColor from "./color_filters.tsx/blend-color";

type props = {
  canvasC: RefObject<CanvasC | null>;
};

function renderFilter({
  condition,
  activeObject,
  disabled,
  fn,
  index,
  name,
}: {
  activeObject?: FabricObject;
  fn: () => void;
  condition: boolean;
  disabled: boolean;
  index: number;
  name: string;
}) {
  switch (name) {
    case "pixelate":
      return (
        <PixelateFilter
          condition={condition}
          disabled={disabled}
          fn={fn}
          index={index}
          activeObject={activeObject}
        />
      );
    case "remove-color":
      return (
        <RemoveColor
          condition={condition}
          disabled={disabled}
          fn={fn}
          index={index}
          activeObject={activeObject}
        />
      );
    case "contrast":
      return (
        <ContrastOption
          condition={condition}
          disabled={disabled}
          fn={fn}
          index={index}
          activeObject={activeObject}
        />
      );
    case "blur":
      return (
        <BlurFilter
          condition={condition}
          disabled={disabled}
          fn={fn}
          index={index}
          activeObject={activeObject}
        />
      );
    case "saturation":
      return (
        <Saturation
          condition={condition}
          disabled={disabled}
          fn={fn}
          index={index}
          activeObject={activeObject}
        />
      );
    case "vibrance":
      return (
        <Vibrance
          condition={condition}
          disabled={disabled}
          fn={fn}
          index={index}
          activeObject={activeObject}
        />
      );
    case "gamma":
      return (
        <Gamma
          condition={condition}
          disabled={disabled}
          fn={fn}
          index={index}
          activeObject={activeObject}
        />
      );
    case "brightness":
      return (
        <Brightness
          condition={condition}
          disabled={disabled}
          fn={fn}
          index={index}
          activeObject={activeObject}
        />
      );
    case "noise":
      return (
        <NoiseFilter
          condition={condition}
          disabled={disabled}
          fn={fn}
          index={index}
          activeObject={activeObject}
        />
      );
    case "hue":
      return (
        <HueFilter
          condition={condition}
          disabled={disabled}
          fn={fn}
          index={index}
          activeObject={activeObject}
        />
      );
    case "blend-color":
      return (
        <BlendColor
          condition={condition}
          disabled={disabled}
          fn={fn}
          index={index}
          activeObject={activeObject}
        />
      );
  }
}

function ImageFiltersOption({ canvasC }: props) {
  const [currFilter, setFilter] = useState<string | null>(null);
  const { activeObject, setFabricObject } = useCanvasStore();

  const handleAddFilter = (index: number, filter: any) => {
    if (!canvasC.current) return;
    canvasC.current.addFilterToImage(filter, index, activeObject);
    setFabricObject(activeObject);
  };

  const handleGetFilterVal = (index: number) => {
    if (activeObject instanceof FabricImage) {
      if (activeObject.filters[index]) {
      }
    }
  };

  const hasFilter = (index: number) => {
    if (activeObject instanceof FabricImage) {
      if (activeObject.filters[index]) {
        return true;
      }
    }
    return false;
  };
  return (
    <div className="flex flex-col w-full divide-y-2">
      {filtersOptions.map((f, i) => (
        <Collapsible open={f.label == currFilter} key={i}>
          <CollapsibleTrigger asChild>
            <div className="w-full flex items-center justify-between">
              <button
                onClick={() => {
                  const exist = ["sepia", "vintage", "polaroid"].find(
                    (v) => v == f.label,
                  );
                  if (exist) return;
                  setFilter((v) => (v === f.label ? null : f.label));
                }}
                key={i}
                className="w-full text-start p-[3px]"
              >
                {f.label[0].toUpperCase() + f.label.slice(1, f.label.length)}
              </button>
              <Checkbox
                onCheckedChange={() => {
                  handleAddFilter(i, new f.filter());
                }}
                defaultChecked={hasFilter(i)}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="w-full px-2 py-2 bg-secondary">
            {renderFilter({
              condition: !activeObject || !canvasC.current || !hasFilter(i),
              activeObject: activeObject,
              disabled: !hasFilter(i),
              fn: () => {
                canvasC.current?.canvas.requestRenderAll();
                setFabricObject(activeObject);
              },
              index: i,
              name: f.label,
            })}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
export default ImageFiltersOption;
