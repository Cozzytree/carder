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

function PixelateFilter({
  condition,
  disabled,
  fn,
  index,
  activeObject,
}: props) {
  return (
    <div
      className="flex flex-col py-4 px-2 rounded-md bg-foreground/20"
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Slider
        max={50}
        min={0}
        defaultValue={[
          activeObject instanceof FabricImage &&
          activeObject.filters[index] instanceof filters.Pixelate
            ? activeObject.filters[index].blocksize
            : 0,
        ]}
        step={0.002}
        disabled={disabled}
        onValueChange={debouncer((e: number[]) => {
          if (condition) return;
          if (
            activeObject instanceof FabricImage &&
            activeObject.filters[index] instanceof filters.Pixelate
          ) {
            activeObject.filters[index].blocksize = e[0];
            activeObject.applyFilters();
            fn();
          }
        }, 100)}
      />
    </div>
  );
}

export default PixelateFilter;
