import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";

type props = {
   fn: (v: number) => void;
   opacity: number;
};

function OpacityOption({ fn, opacity }: props) {
   const [currOpac, setOpac] = useState(opacity * 100);
   useEffect(() => {
      setOpac(opacity * 100);
   }, [opacity]);

   return (
      <div className="flex justify-center items-center w-32">
         <div className="w-full flex items-center gap-1">
            <span>{currOpac}</span>
            <Slider
               value={[currOpac]}
               onValueChange={(e) => {
                  fn(e[0] / 100);
                  setOpac(e[0]);
               }}
               min={0}
               step={5}
               max={100}
            />
         </div>
      </div>
   );
}

export default OpacityOption;
