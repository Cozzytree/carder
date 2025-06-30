import UpDown from "@/components/updown";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { zooms } from "../constants";
import { Button } from "@/components/ui/button";
import { useZoomContext } from "@/components/zoomable";

function ZoomContainer() {
   const { setZoom, zoom } = useZoomContext();
   return (
      <div className="w-full flex justify-between items-center">
         <UpDown
            defaultV={zoom * 100}
            rate={20}
            onChange={(v) => {
               if (v < 50 || v > 500) return;
               setZoom(v / 100);
            }}
         >
            <DropdownMenu>
               <DropdownMenuTrigger className="text-nowrap text-sm">
                  {(zoom * 100).toFixed(0)} %
               </DropdownMenuTrigger>
               <DropdownMenuContent className="flex flex-col">
                  {zooms.map((z, i) => (
                     <Button
                        onClick={() => {
                           setZoom(z / 100);
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
         {/* <div className="w-32 hidden md:block">
            <Slider
               className="w-full"
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
         </div> */}
      </div>
   );
}

export default ZoomContainer;
