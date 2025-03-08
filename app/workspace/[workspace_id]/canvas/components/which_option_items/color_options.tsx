import { Button } from "@/components/ui/button";
import { debouncer } from "@/lib/utils";
import { ColorStop, FabricObject, Gradient } from "fabric";
import { CircleXIcon, PlusCircle, XCircle } from "lucide-react";
import { ChangeEvent, RefObject, useState } from "react";
import { colors, gradients } from "../../constants";
import { useCanvasStore } from "../../store";
import CanvasC from "../../canvas";

type props = {
  handleColor: (v: string) => void;
  canvasC?: RefObject<CanvasC | null>;
  handleGradient: (g: string[], type?: "radial" | "linear") => void;
};

function ColorOptions({ handleColor, handleGradient, canvasC }: props) {
  const [tab, setTab] = useState<"colors" | "gradient">("colors");
  const activeObject = useCanvasStore((state) => state.activeObject);

  return (
    <div className="w-full flex flex-col gap-2 items-center justify-center">
      <div className="w-full border-b-2 border-foreground flex items-center gap-2">
        <button
          onClick={() => {
            setTab("colors");
          }}
          className={`${tab === "colors" && "font-bold text-md"} text-sm md:text-lg p-1`}
        >
          Standard
        </button>
        <button
          onClick={() => {
            setTab("gradient");
          }}
          className={`${tab === "gradient" && "font-bold text-md"} text-sm md:text-lg p-1`}
        >
          Gradient
        </button>
      </div>

      <div className="w-full">
        {tab === "colors" ? (
          <div className="grid grid-cols-5 gap-2">
            <button
              onClick={() => {
                handleColor("");
              }}
              className="w-8 h-8 rounded-full"
            >
              <CircleXIcon className="w-8 h-8" fill="red" />
            </button>
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
        ) : (
          <div className="flex w-full flex-col gap-3">
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
            <GradientToggle
              canvasC={canvasC}
              handleToggle={(v) => {
                const stops = activeObject?.get("fill")
                  .colorStops as ColorStop[];
                if (!Array.isArray(stops)) return;
                const c = stops.map((col) => col.color);
                handleGradient(c, v);
              }}
              activeObject={activeObject}
            />
            <CustomGradientColor handleGradient={handleGradient} />
          </div>
        )}
      </div>
    </div>
  );
}

function CustomGradientColor({
  handleGradient,
}: {
  handleGradient: (v: string[]) => void;
}) {
  const [colors, setColors] = useState<string[] | []>([]);
  const [color, setColor] = useState<string | null>("#202018");
  return (
    <div className="w-full mt-4 flex flex-col gap-2">
      <div className="flex gpa-2 items-center">
        <label
          style={{ background: color || "" }}
          className="block w-7 h-7 rounded-full border-2 border-foreground/80"
          htmlFor="c-gra"
        ></label>
        <input
          onChange={(e) => {
            setColor(e.target.value);
          }}
          type="color"
          className="hidden"
          id="c-gra"
        />
        <button
          className="px-1"
          onClick={() => {
            if (color) {
              setColors((c) => [...c, color]);
            }
          }}
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-1 flex-wrap items-center">
        {colors.map((c, i) => (
          <div key={i} className="group flex items-center gap-2 relative">
            <button
              onClick={() => {
                setColors((c) => {
                  return c.filter((_, index) => index != i);
                });
              }}
              className="opacity-100 md:opacity-0 group-hover:opacity-100 absolute -top-2 right-4"
            >
              <XCircle className="text-foreground w-4 h-4" />
            </button>
            <label
              style={{ background: c || "" }}
              className="block w-7 h-7 rounded-full border-2 border-foreground/80"
              htmlFor={`c-gra${i}`}
            ></label>
            <input
              onChange={(e) => {
                setColors((c) => {
                  c[i] = e.target.value;
                  return [...c];
                });
              }}
              type="color"
              className="hidden"
              id={`c-gra${i}`}
            />
            {i != colors.length - 1 && "+"}
          </div>
        ))}
        =
        <div
          className="w-7 h-7 rounded-full border-2 border-foreground/50"
          style={{
            background: `linear-gradient(${colors.join(",")})`,
          }}
        />
        <Button
          onClick={() => {
            if (colors.length >= 2) {
              handleGradient(colors);
            }
          }}
          variant={"outline"}
          size={"xs"}
          className=""
        >
          add
        </Button>
      </div>
    </div>
  );
}

function GradientToggle({
  activeObject,
  handleToggle,
  canvasC,
}: {
  activeObject?: FabricObject;
  canvasC?: RefObject<CanvasC | null>;
  handleToggle: (v: "radial" | "linear") => void;
}) {
  const camvasGradient: Gradient<"radial" | "linear"> | string =
    canvasC?.current?.canvas.backgroundColor;
  return (
    <div className="w-full flex flex-col gap-2">
      <h4>Gradient type</h4>
      <div>
        <Button
          onClick={() => {
            handleToggle("linear");
          }}
          variant={
            activeObject
              ? activeObject?.get("fill")?.type === "linear"
                ? "default"
                : "outline"
              : camvasGradient?.type == "linear"
                ? "default"
                : "outline"
          }
          size={"xs"}
        >
          linear
        </Button>
        <Button
          onClick={() => {
            handleToggle("radial");
          }}
          variant={
            activeObject
              ? activeObject?.get("fill")?.type === "radial"
                ? "default"
                : "outline"
              : camvasGradient?.type == "radial"
                ? "default"
                : "outline"
          }
          size={"xs"}
        >
          Radial
        </Button>
      </div>
    </div>
  );
}

export default ColorOptions;
