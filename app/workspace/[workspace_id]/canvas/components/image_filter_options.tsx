import { filtersOptions } from "../constants";
import { RefObject, useState } from "react";
import CanvasC from "../canvas";
import { useCanvasStore } from "../store";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FabricImage, filters } from "fabric";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { debouncer } from "@/lib/utils";
import Gamma from "./color_filters.tsx/gamma";
import Brightness from "./color_filters.tsx/brightness";
import ContrastOption from "./color_filters.tsx/contrast";

type props = {
  canvasC: RefObject<CanvasC | null>;
};

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
        console.log(activeObject.filters[index]);
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
                  handleGetFilterVal(i);
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
            {f.label == "contrast" && (
              <ContrastOption
                condition={!activeObject || !canvasC.current || !hasFilter(i)}
                index={i}
                fn={() => {
                  canvasC.current?.canvas.requestRenderAll();
                }}
                disabled={!hasFilter(i)}
                activeObject={activeObject}
              />
            )}
            {f.label == "hue" && (
              <div className="flex items-center gap-2">
                <Slider
                  onValueChange={debouncer((e: number[]) => {
                    if (!hasFilter(i) || !canvasC.current || !activeObject)
                      return;
                    if (activeObject instanceof FabricImage) {
                      if (
                        activeObject.filters[i] instanceof filters.HueRotation
                      ) {
                        activeObject.filters[i].rotation = e[0];
                        activeObject.applyFilters();
                        canvasC.current.canvas.requestRenderAll();
                      }
                    }
                  }, 50)}
                  className="w-full"
                  defaultValue={[0]}
                  max={2}
                  min={-2}
                  step={0.002}
                  disabled={!hasFilter(i)}
                />
              </div>
            )}
            {f.label == "blur" && (
              <div className="flex items-center gap-2">
                <Slider
                  onValueChange={debouncer((e: number[]) => {
                    if (!hasFilter(i) || !canvasC.current || !activeObject)
                      return;
                    if (activeObject instanceof FabricImage) {
                      if (activeObject.filters[i] instanceof filters.Blur) {
                        activeObject.filters[i].blur = e[0];
                        activeObject.applyFilters();
                        canvasC.current.canvas.requestRenderAll();
                      }
                    }
                  }, 50)}
                  className="w-full"
                  defaultValue={[0]}
                  max={1}
                  min={-1}
                  step={0.002}
                  disabled={!hasFilter(i)}
                />
              </div>
            )}
            {f.label == "noise" && (
              <div className="flex items-center gap-2">
                <Slider
                  onValueChange={debouncer((e: number[]) => {
                    if (!hasFilter(i) || !canvasC.current || !activeObject)
                      return;
                    if (activeObject instanceof FabricImage) {
                      if (activeObject.filters[i] instanceof filters.Noise) {
                        activeObject.filters[i].noise = e[0];
                        activeObject.applyFilters();
                        canvasC.current.canvas.requestRenderAll();
                      }
                    }
                  }, 100)}
                  className="w-full"
                  defaultValue={[0]}
                  max={100}
                  min={0}
                  step={10}
                  disabled={!hasFilter(i)}
                />
              </div>
            )}
            {f.label == "saturation" && (
              <div className="flex items-center gap-2">
                <Slider
                  onValueChange={debouncer((e: number[]) => {
                    if (!hasFilter(i) || !canvasC.current || !activeObject)
                      return;
                    if (activeObject instanceof FabricImage) {
                      if (
                        activeObject.filters[i] instanceof filters.Saturation
                      ) {
                        activeObject.filters[i].saturation = e[0];
                        activeObject.applyFilters();
                        canvasC.current.canvas.requestRenderAll();
                      }
                    }
                  }, 50)}
                  className="w-full"
                  defaultValue={[0]}
                  max={1}
                  min={-1}
                  step={0.02}
                  disabled={!hasFilter(i)}
                />
              </div>
            )}
            {f.label == "vibrance" && (
              <div className="flex items-center gap-2">
                <Slider
                  onValueChange={debouncer((e: number[]) => {
                    if (!hasFilter(i) || !canvasC.current || !activeObject)
                      return;
                    if (activeObject instanceof FabricImage) {
                      if (activeObject.filters[i] instanceof filters.Vibrance) {
                        activeObject.filters[i].vibrance = e[0];
                        activeObject.applyFilters();
                        canvasC.current.canvas.requestRenderAll();
                      }
                    }
                  }, 50)}
                  className="w-full"
                  defaultValue={[0]}
                  max={1}
                  min={-1}
                  step={0.003}
                  disabled={!hasFilter(i)}
                />
              </div>
            )}
            {f.label == "gamma" && (
              <Gamma
                index={i}
                condition={!hasFilter(i) || !canvasC.current || !activeObject}
                activeObject={activeObject}
                fn={() => {
                  canvasC?.current?.canvas.requestRenderAll();
                }}
                disabled={!hasFilter(i)}
              />
            )}
            {f.label == "brightness" && (
              <Brightness
                condition={!activeObject || !canvasC.current || !hasFilter(i)}
                index={i}
                fn={() => {
                  canvasC.current?.canvas.requestRenderAll();
                }}
                disabled={!hasFilter(i)}
                activeObject={activeObject}
              />
            )}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}

// function SliderValue({
//   defaultVal,
//   disabled,
//   fn,
//   min,
//   max,
//   step,
// }: {
//   step: number;
//   max: number;
//   min: number;
//   defaultVal: number;
//   disabled: boolean;
//   fn: (e: number) => void;
// }) {
//   return (
//     <Slider
//       step={step}
//       max={max}
//       min={min}
//       defaultValue={[defaultVal]}
//       disabled={disabled}
//       onChange={debouncer((e: number[]) => {
//         fn(e);
//       }, 50)}
//     />
//   );
// }

export default ImageFiltersOption;
