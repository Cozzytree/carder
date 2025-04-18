import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";
import { alphas, colors } from "../constants";
import { Button } from "@/components/ui/button";
import { TFiller } from "fabric";
import { useColorStore } from "../store";

type props = {
   children: ReactNode;
   fn: (v: string) => void;
   color: TFiller | string | null;
};

function ColorOptions({ color, fn, children }: props) {
   const { setAlpha, alpha } = useColorStore();

   const a = String(alpha == 1 ? "ff" : alpha * 100);

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
         <DropdownMenuContent align="start" sideOffset={10} side="right" className="w-fiit bg-secondary p-2 shadow-lg rounded-lg border">
            <div className="grid grid-cols-5 gap-2">
               {colors.map((c, i) => (
                  <Button
                     onClick={() => {
                        const col = c + a;
                        fn(col);
                     }}
                     style={{
                        background: c,
                     }}
                     variant={"outline"}
                     className={`${c + a === color && "ring-2"} w-6 h-6`}
                     size={"xs"}
                     key={i}
                  />
               ))}

               <label htmlFor="color" className="w-6 h-6 bg-gradient-to-r from-red-500 to-lime-600 rounded-md" />
               <input
                  onChange={(e) => {
                     let time = null;
                     if (time) {
                        clearTimeout(time);
                     }
                     time = setTimeout(() => {
                        fn(e.target.value);
                     }, 100);
                  }}
                  type="color"
                  id="color"
                  className="hidden"
               />
            </div>
            <div>
               <DropdownMenuLabel>Aplha</DropdownMenuLabel>
               <div className="grid grid-cols-2 gap-2">
                  {alphas.map((a, i) => (
                     <Button
                        onClick={() => {
                           setAlpha(a);
                        }}
                        size="xs"
                        className={`${a == alpha && "ring-2"} p-0 relative h-6`}
                        variant={"outline"}
                        key={i}
                     >
                        <span className="absolute left-1 text-sm">{a}</span>
                        <div
                           style={{
                              background: color?.toString(),
                              opacity: a,
                           }}
                           className="w-full h-full"
                        />
                     </Button>
                  ))}
               </div>
            </div>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}

export default ColorOptions;
