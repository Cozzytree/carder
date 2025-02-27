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
function Gamma({ condition, index, disabled, activeObject, fn }: props) {
  return (
    <div
      className="flex flex-col py-2 px-2 rounded-md bg-foreground/20"
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      {[0, 1, 2].map((g, i) => (
        <div key={i} className="w-full py-1 gap-2 flex items-center">
          <span className="text-sm w-16">
            {g == 0 && "Red"}
            {g == 1 && "Green"}
            {g == 2 && "Blue"}
          </span>
          <Slider
            onValueChange={debouncer((e: number[]) => {
              if (condition) return;
              if (
                activeObject instanceof FabricImage &&
                activeObject.filters[index] instanceof filters.Gamma
              ) {
                activeObject.filters[index].gamma[g] = e[0];
                activeObject.applyFilters();
                fn();
              }
            }, 100)}
            className="w-full"
            defaultValue={[0]}
            max={2.2}
            min={0.2}
            step={0.003}
            disabled={disabled}
          />
        </div>
      ))}
    </div>
  );
}

export default Gamma;
