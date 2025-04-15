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

function Brightness({ condition, disabled, fn, index, activeObject }: props) {
  return (
    <div
      className="flex flex-col py-2 px-2 rounded-md bg-foreground/20"
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Slider
        max={1}
        min={-1}
        step={0.1}
        onValueChange={debouncer((e: number[]) => {
          if (condition) return;
          if (
            activeObject instanceof FabricImage &&
            activeObject.filters[index] instanceof filters.Brightness
          ) {
            activeObject.filters[index].brightness = e[0];
            activeObject.applyFilters();
            fn();
          }
        }, 100)}
      />
    </div>
  );
}

export default Brightness;
