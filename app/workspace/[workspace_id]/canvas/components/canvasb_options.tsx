import { useState } from "react";
import ColorOptions from "./color_options";
import { Button } from "@/components/ui/button";
import { TFiller } from "fabric";

type props = {
   fn: (v: string) => void;
   color: TFiller | string | null;
};

function CanvasBackgroundOption({ fn, color }: props) {
   const [c, setC] = useState(color);
   return (
      <div>
         <ColorOptions
            color={c}
            fn={(v) => {
               fn(v);
               setC(v);
            }}
         >
            <Button
               style={{ background: String(c) }}
               size={"xs"}
               variant={"outline"}
               className="w-6 h-6"
            />
         </ColorOptions>
      </div>
   );
}

export default CanvasBackgroundOption;
