import { Button } from "@/components/ui/button";
import { TFiller } from "fabric";
import { useEffect, useState } from "react";
import ColorOptions from "./color_options";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MinusIcon } from "lucide-react";
import { widths } from "../constants";
import { Slider } from "@/components/ui/slider";

type props = {
   fn: (v: string) => void;
   stroke: TFiller | string | null;
   stroke_width: number;
   fnStroke: (v: number) => void;
};

function StrokeOptions({ stroke, stroke_width, fn, fnStroke }: props) {
   const [currStroke, setStroke] = useState(stroke);
   const [currwidth, setWidth] = useState(stroke_width);
   useEffect(() => {
      setStroke(stroke);
   }, [stroke]);

   return (
      <>
         <ColorOptions
            color={currStroke}
            fn={(v) => {
               fn(v);
               setStroke(v);
            }}
         >
            <Button
               className="h-6 w-6"
               size={"xs"}
               variant={"outline"}
               style={{ border: `4px solid ${String(currStroke)}` }}
            />
         </ColorOptions>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button className="w-6 h-6" variant={"outline"} size={"xs"}>
                  <MinusIcon />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent asChild>
               <div className="flex flex-col gap-3 h-fit p-2 w-32">
                  <div className="flex flex-col gap-0">
                     {widths.map((w, i) => (
                        <Button
                           onClick={() => {
                              fnStroke(w);
                              setWidth(w);
                           }}
                           className={`w-full h-6`}
                           variant={"outline"}
                           size="xs"
                           key={i}
                        >
                           <div
                              style={{ height: w + "px" }}
                              className={`w-full border border-foreground bg-foreground`}
                           />
                        </Button>
                     ))}
                  </div>
                  <div className="flex gap-1 items-center">
                     <span className="text-xs text-foreground">
                        {currwidth}
                     </span>
                     <Slider
                        value={[currwidth]}
                        onValueChange={(e) => {
                           if (!e[0]) return;
                           fnStroke(e[0]);
                           setWidth(e[0]);
                        }}
                        max={100}
                        min={1}
                        step={2}
                     />
                  </div>
               </div>
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   );
}

export default StrokeOptions;
