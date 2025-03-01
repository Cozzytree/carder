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

function BlendColor({ condition, disabled, fn, index, activeObject }: props) {
  const color =
    activeObject instanceof FabricImage &&
    activeObject.filters[index] instanceof filters.BlendColor
      ? activeObject.filters[index].color
      : "";

  return (
    <div
      className="flex items-center gap-2 py-4 px-2 rounded-md bg-foreground/20"
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <label
        style={{
          background: color,
        }}
        htmlFor="blend-c"
        className="w-7 h-7 shrink-0 border border-foreground rounded-full"
      ></label>
      <input
        onChange={(e) => {
          if (
            activeObject instanceof FabricImage &&
            activeObject.filters[index] instanceof filters.BlendColor
          ) {
            activeObject.filters[index].color = e.target.value;
            activeObject.applyFilters();
            fn();
          }
        }}
        id="blend-c"
        type="color"
        className="hidden"
      />

      <Slider
        className="w-36"
        min={0}
        max={20}
        defaultValue={[0]}
        onValueChange={debouncer((e: number[]) => {
          if (condition) return;
          if (
            activeObject instanceof FabricImage &&
            activeObject.filters[index] instanceof filters.BlendColor
          ) {
            activeObject.filters[index].alpha = e[0];
            activeObject.applyFilters();
            fn();
          }
        }, 100)}
      />
    </div>
  );
}

export default BlendColor;
