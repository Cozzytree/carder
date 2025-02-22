import { useState } from "react";
import { colors, gradients } from "../../constants";

type props = {
   handleColor: (v: string) => void;
   handleGradient: (g: string[]) => void;
};

function ColorOptions({ handleColor, handleGradient }: props) {
   const [tab, setTab] = useState<"colors" | "gradient">("colors");
   return (
      <div className="w-full flex flex-col gap-2 items-center justify-center">
         <div className="w-full border-b-2 border-foreground flex items-center gap-2">
            <button
               onClick={() => {
                  setTab("colors");
               }}
               className={`${tab === "colors" && "font-bold text-md"} text-sm p-1`}
            >
               Standard
            </button>
            <button
               onClick={() => {
                  setTab("gradient");
               }}
               className={`${tab === "gradient" && "font-bold text-md"} text-sm p-1`}
            >
               Gradient
            </button>
         </div>

         {tab === "colors" ? (
            <div className="w-full grid grid-cols-5 gap-2">
               {colors.map((c, i) => (
                  <button
                     onClick={() => {
                        handleColor(c);
                     }}
                     className="w-8 h-8 rounded-full border-foreground/40 border-2"
                     key={i}
                     style={{ background: c }}
                  />
               ))}
            </div>
         ) : (
            <div className="w-full grid grid-cols-5 gap-2">
               {gradients.map((g, i) => (
                  <button
                     onClick={() => {
                        handleGradient(g);
                     }}
                     key={i}
                     className="w-8 h-8 rounded-full border-foreground/40 border-2"
                     style={{ background: `linear-gradient(${g[0]},${g[1]})` }}
                  />
               ))}
            </div>
         )}
      </div>
   );
}
export default ColorOptions;
