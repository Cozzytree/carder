import { Slider } from "@/components/ui/slider";
import { debouncer } from "@/lib/utils";
import { FabricImage, FabricObject, filters } from "fabric";

type props = {
  activeObject?: FabricObject;
  fn: () => void;
  condition: boolean;
  disabled: boolean;
  index: number;
};

function RemoveColor({ condition, disabled, fn, index, activeObject }: props) {
  return (
    <div
      className="flex flex-col py-4 px-2 rounded-md bg-foreground/20"
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <label
        className="w-7 h-7 rounded-full"
        style={{
          background:
            activeObject instanceof FabricImage &&
            activeObject.filters[index] instanceof filters.RemoveColor
              ? activeObject.filters[index].color
              : "",
        }}
        htmlFor="b-color"
      ></label>
      <input
        onChange={(e) => {
          if (
            activeObject instanceof FabricImage &&
            activeObject.filters[index] instanceof filters.RemoveColor
          ) {
            activeObject.filters[index].color = e.target.value;
            activeObject.applyFilters();
            fn();
          }
        }}
        id="b-color"
        type="color"
        className="hidden"
      />

      <div className="w-full flex items-center gap-2">
        <span className="text-sm">Distance</span>
        <Slider
          min={0}
          step={0.002}
          max={1}
          defaultValue={[
            activeObject instanceof FabricImage &&
            activeObject.filters[index] instanceof filters.RemoveColor
              ? activeObject.filters[index].distance
              : 0,
          ]}
          onValueChange={debouncer((e: number[]) => {
            if (
              activeObject instanceof FabricImage &&
              activeObject.filters[index] instanceof filters.RemoveColor
            ) {
              activeObject.filters[index].distance = e[0];
              activeObject.applyFilters();
              fn();
            }
          }, 100)}
        />
      </div>
    </div>
  );
}

export default RemoveColor;
