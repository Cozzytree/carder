import { ChangeEvent, useState } from "react";
import { colors, gradients } from "../../constants";
import { debouncer } from "@/lib/utils";

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

      <div className="w-full grid grid-cols-5 gap-2">
        {tab === "colors" ? (
          <>
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
          </>
        ) : (
          <>
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
          </>
        )}
        <label
          htmlFor="customcolor"
          className="gradient w-8 h-8 cursor-pointer rounded-full bg-foreground"
        ></label>
        <input
          onChange={debouncer((e: ChangeEvent<HTMLInputElement>) => {
            handleColor(e.target.value);
          }, 50)}
          type="color"
          id="customcolor"
          className="hidden"
        />
      </div>
    </div>
  );
}
export default ColorOptions;
