import { Slider } from "@/components/ui/slider";
import { debouncer } from "@/lib/utils";

type props = {
  fn: (v: number) => void;
  opacity: number;
};

function OpacityOption({ fn, opacity }: props) {
  return (
    <div className="flex flex-col justify-center items-center w-32">
      <div className="w-full flex items-center gap-1">
        <span className="w-12">{opacity}</span>
        <Slider
          defaultValue={[opacity * 100]}
          onValueChange={debouncer((e) => {
            fn(e[0] / 100);
          }, 100)}
          min={0}
          step={5}
          max={100}
        />
      </div>
    </div>
  );
}

export default OpacityOption;
