import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

type props = {
  fn: (v: number) => void;
  radiuses: number;
};

function RadiusOption({ fn, radiuses }: props) {
  const [currradius, setRadius] = useState(radiuses);

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size={"xs"} className="w-6 h-6 p-1">
            <div className="border-t-2 border-l-2 border-foreground w-full h-full rounded-tl-lg" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="py-4 flex items-center gap-1">
          <span className="text-xs text-foreground">{currradius}</span>
          <Slider
            defaultValue={[currradius]}
            onValueChange={(e) => {
              if (!e[0]) return;
              fn(e[0]);
              setRadius(e[0]);
            }}
            step={5}
            max={50}
            min={0}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default RadiusOption;
