import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TFiller } from "fabric";
import ColorOptions from "./color_options";

type props = {
  stroke: TFiller | string | null;
  fn: (v: string) => void;
};
function FillOprions({ fn, stroke }: props) {
  const [currFill, setFill] = useState(stroke);

  return (
    <div className="flex items-center gap-2">
      <ColorOptions
        color={currFill}
        fn={(v) => {
          fn(v);
          setFill(v);
        }}
      >
        <Button
          className="w-6 h-6"
          size={"xs"}
          variant={"outline"}
          style={{ background: String(currFill) }}
        />
      </ColorOptions>
    </div>
  );
}

export default FillOprions;
