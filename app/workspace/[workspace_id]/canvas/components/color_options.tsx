import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";
import { colors } from "../constants";
import { Button } from "@/components/ui/button";
import { TFiller } from "fabric";

type props = {
  children: ReactNode;
  fn: (v: string) => void;
  color: TFiller | string | null;
};

function ColorOptions({ color, fn, children }: props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="grid grid-cols-5 bg-secondary gap-2 p-2 shadow-lg rounded-lg border"
        align="start"
        sideOffset={10}
        side="right"
      >
        {colors.map((c, i) => (
          <Button
            onClick={() => {
              fn(c);
            }}
            style={{ background: c }}
            variant={"outline"}
            className={`${c === color && "ring-2"} w-6 h-6`}
            size={"xs"}
            key={i}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ColorOptions;
