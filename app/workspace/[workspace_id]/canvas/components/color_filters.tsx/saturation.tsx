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

function Saturation({ condition, disabled, fn, index, activeObject }: props) {
  return (
    <div
      className="flex flex-col py-4 px-2 rounded-md bg-foreground/20"
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Slider
        max={1}
        min={-1}
        step={0.02}
        defaultValue={[
          activeObject instanceof FabricImage &&
          activeObject.filters[index] instanceof filters.Saturation
            ? activeObject.filters[index].saturation
            : 0,
        ]}
        disabled={disabled}
        onValueChange={debouncer((e: number[]) => {
          if (condition || disabled) return;
          if (
            activeObject instanceof FabricImage &&
            activeObject.filters[index] instanceof filters.Saturation
          ) {
            activeObject.filters[index].saturation = e[0];
            activeObject.applyFilters();
            fn();
          }
        }, 100)}
      />
    </div>
  );
}

export default Saturation;
