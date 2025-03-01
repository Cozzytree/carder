import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { zooms } from "../constants";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RefObject } from "react";
import UpDown from "@/components/updown";

type props = {
  zoomLevel: number;
  handleZoom: (v: number) => void;
  containerRef: RefObject<HTMLDivElement | null>;
};

function ZoomContainer({ handleZoom, zoomLevel, containerRef }: props) {
  return (
    <div className="flex items-center">
      <UpDown
        defaultV={zoomLevel * 100}
        onChange={(v) => {
          if (containerRef.current) {
            handleZoom(v / 100);
            containerRef.current.style.scale = `${v / 100}`;
          }
        }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger className="text-nowrap text-sm">
            {(zoomLevel * 100).toFixed(0)} %
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col">
            {zooms.map((z, i) => (
              <Button
                onClick={() => {
                  if (containerRef.current) {
                    handleZoom(z / 100);
                    containerRef.current.style.scale = `${z / 100}`;
                  }
                }}
                key={i}
                size={"icon"}
                variant={"outline"}
              >
                {z} %
              </Button>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </UpDown>
      <div className="w-32 hidden md:block">
        <Slider
          defaultValue={[zoomLevel * 100]}
          onValueChange={(e) => {
            const v = Number(e[0]);
            if (containerRef.current) {
              handleZoom(v / 100);
              containerRef.current.style.scale = `${v / 100}`;
            }
          }}
          min={20}
          step={5}
          max={300}
        />
      </div>
    </div>
  );
}

export default ZoomContainer;
