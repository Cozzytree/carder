import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn, debouncer } from "@/lib/utils";
import { ColorStop, Gradient, GradientType } from "fabric";
import { CircleXIcon, PlusCircle, XCircle } from "lucide-react";
import { ChangeEvent, RefObject, useState } from "react";
import CanvasC from "../../canvas";
import { colors, gradients } from "../../constants";
import { useCanvasStore, useColorStore } from "../../store";
import BtnWithColor from "../btn-with-color";

type props = {
  handleColor: (v: string) => void;
  canvasC?: RefObject<CanvasC | null>;

  // to check if color is changed for canvas or object
  forCanvas?: boolean;

  color?: string | Gradient<"linear" | "radial">;

  showGradient?: boolean;
  showGradientOptions?: boolean;

  // object or canvas props for gradient adjustemnt
  width?: number;
  height?: number;

  handleGradient?: (g: string[], type?: "radial" | "linear") => void;
};

function ColorOptions({
  handleColor,
  handleGradient,
  canvasC,
  color,
  width,
  height,
  forCanvas,
  showGradient = true,
  showGradientOptions = false,
}: props) {
  const [tab, setTab] = useState<"colors" | "gradient">("colors");
  const setRecentColor = useColorStore((state) => state.setRecentColors);
  const setRecentGradient = useColorStore((state) => state.setRecentGradient);
  const recentColors = useColorStore((state) => state.recentColors);
  const recentGradients = useColorStore((state) => state.recentGradients);

  return (
    <div className="w-full flex flex-col gap-2 items-center justify-center">
      <div className="w-full border-b-2 border-foreground flex items-center gap-2">
        <button
          onClick={() => {
            setTab("colors");
          }}
          className={`${tab === "colors" && "font-bold text-md"} text-xs md:text-lg p-1`}
        >
          Standard
        </button>
        {showGradient && (
          <button
            onClick={() => {
              setTab("gradient");
            }}
            className={`${tab === "gradient" && "font-bold text-md"} text-sm md:text-lg p-1`}
          >
            Gradient
          </button>
        )}
      </div>

      <div className="w-full flex flex-col">
        {tab === "colors" ? (
          <>
            <div className="mb-4">
              <h4 className="font-semibold">Recent</h4>
              <div className="w-full grid grid-cols-5 gap-1">
                {recentColors.map((c, i) => (
                  <BtnWithColor
                    onClick={() => {
                      handleColor(c);
                    }}
                    w={28}
                    h={28}
                    color={c}
                    key={i}
                  />
                ))}
              </div>
            </div>

            {/* {///} */}

            <div className="grid grid-cols-5 w-fit gap-1">
              <button
                onClick={() => {
                  handleColor("");
                }}
                className="rounded-full"
              >
                <CircleXIcon className="w-7 h-7 md:w-8 md:h-8" fill="red" />
              </button>
              {colors.map((c, i) => (
                <button
                  onClick={() => {
                    handleColor(c);
                    setRecentColor(c);
                  }}
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full border-foreground/40 border-2"
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
                  setRecentColor(e.target.value);
                }, 50)}
                type="color"
                id="customcolor"
                className="hidden"
              />
            </div>
          </>
        ) : (
          <>
            {showGradient && color && (
              <div className="flex w-full flex-col gap-1">
                <div className="flex flex-col gap-1 mb-2">
                  {recentGradients.length && (
                    <>
                      <h4>Recent</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {recentGradients.map((g, i) => (
                          <BtnWithColor
                            w={28}
                            h={28}
                            onClick={() => {
                              handleGradient?.(
                                g,
                                color instanceof Gradient
                                  ? color.type
                                  : "linear",
                              );
                            }}
                            color={g}
                            key={i}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="w-full grid grid-cols-5 gap-1">
                  {gradients.map((g, i) => (
                    <BtnWithColor
                      w={28}
                      h={28}
                      gradientType={
                        color instanceof Gradient ? color.type : "linear"
                      }
                      key={i}
                      onClick={() => {
                        handleGradient?.(
                          g,
                          color instanceof Gradient ? color.type : "linear",
                        );
                        setRecentGradient(g);
                      }}
                      color={g}
                    />
                  ))}
                </div>
                <GradientToggle
                  showOptions={showGradientOptions}
                  forCanvas={!!forCanvas}
                  canvasC={canvasC}
                  width={width || 100}
                  height={height || 100}
                  color={color}
                  handleToggle={(v) => {
                    if (color instanceof Gradient) {
                      const stops = color.colorStops as ColorStop[];
                      if (!Array.isArray(stops)) return;
                      const c = stops.map((col) => col.color);
                      handleGradient?.(c, v);
                      setRecentGradient(c);
                    }
                  }}
                />
                <CustomGradientColor
                  handleGradient={(c) =>
                    handleGradient?.(
                      c,
                      color instanceof Gradient ? color.type : "linear",
                    )
                  }
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CustomGradientColor({
  handleGradient,
}: {
  handleGradient?: (v: string[]) => void;
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
              handleGradient?.(colors);
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
  handleToggle,
  color,
  height,
  width,
  canvasC,
  forCanvas,
  showOptions,
}: {
  canvasC?: RefObject<CanvasC | null>;
  color: string | Gradient<"linear" | "radial">;
  handleToggle: (v: "radial" | "linear") => void;
  width: number;
  height: number;
  forCanvas: boolean;
  showOptions: boolean;
}) {
  const { activeObject, setFabricObject } = useCanvasStore();
  const gradient = color instanceof Gradient ? color : null;

  return (
    <div className="w-full flex flex-col gap-1 mt-2">
      <h4 className="font-semibold text-sm md:text-md">Gradient type</h4>
      <div className="flex">
        <div>
          <button
            onClick={() => {
              handleToggle("linear");
            }}
            className={cn(
              gradient
                ? gradient.type === "linear"
                  ? "bg-foreground text-background"
                  : "bg-secondary"
                : "bg-secondary",
              "text-sm px-2 rounded-sm py-[2px] md:py-1",
            )}
          >
            linear
          </button>
          <button
            className={cn(
              gradient
                ? gradient.type === "radial"
                  ? "bg-foreground text-background"
                  : "bg-secondary"
                : "bg-secondary",
              "text-sm px-2 rounded-sm py-[2px] md:py-1",
            )}
            onClick={() => {
              handleToggle("radial");
            }}
          >
            radial
          </button>
        </div>
      </div>

      {showOptions && (
        <>
          {/* {adjust inner and outer circle} */}
          <div className="mt-1 flex flex-col gap-1">
            {gradient && (
              <>
                {[
                  { label: "start-x", l: "x1", df: gradient.coords.x1 },
                  { label: "start-y", l: "y1", df: gradient.coords.y1 },
                  { label: "end-x", l: "x1", df: gradient.coords.x2 },
                  { label: "end-y", l: "y1", df: gradient.coords.y2 },
                ].map((v, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-sm text-nowrap">{v.label}</span>
                    <RadialPropertyChange
                      color={gradient}
                      defaultVal={v.df}
                      fn={(g) => {
                        if (!canvasC?.current) return;
                        const newG = new Gradient({
                          colorStops: gradient.colorStops,
                          offsetX: gradient.offsetX,
                          offsetY: gradient.offsetY,
                          type: gradient.type,
                          coords: { ...gradient.coords, [v.l]: g },
                        });

                        if (forCanvas) {
                          canvasC.current.changeCanvasColor(newG);
                        } else if (activeObject) {
                          canvasC.current.changeCanvasProperties(activeObject, {
                            fill: newG,
                          });
                        }
                        setFabricObject(activeObject);
                      }}
                      max={width}
                    />
                  </div>
                ))}
              </>
            )}

            {gradient && gradient.type == "radial" && (
              <>
                {[
                  {
                    label: "inner-circle",
                    l: "r1",
                    df: gradient.coords?.r1 || 0,
                  },
                  {
                    label: "outer-circle",
                    l: "r2",
                    df: gradient.coords?.r2 || 0,
                  },
                ].map((v, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-sm">{v.label}</span>
                    <RadialPropertyChange
                      color={gradient}
                      defaultVal={v.df}
                      fn={(g) => {
                        if (!canvasC?.current) return;
                        const newG = new Gradient({
                          colorStops: gradient.colorStops,
                          offsetX: gradient.offsetX,
                          offsetY: gradient.offsetY,
                          type: gradient.type,
                          coords: { ...gradient.coords, [v.l]: g },
                        });

                        if (forCanvas) {
                          canvasC.current.changeCanvasColor(newG);
                        } else if (activeObject) {
                          canvasC.current.changeCanvasProperties(activeObject, {
                            fill: newG,
                          });
                        }
                        setFabricObject(activeObject);
                      }}
                      max={width}
                    />
                  </div>
                ))}
              </>
            )}
          </div>

          {/* {gradient offset} */}
          <div className="space-y-1 mt-2">
            {gradient && (
              <>
                <h4 className="font-semibold">Gradient offset</h4>
                {[
                  {
                    label: "offset x",
                    prop: "offsetX",
                    max: width,
                    min: -width / 2,
                    df: gradient.offsetX,
                  },
                  {
                    label: "offset y",
                    prop: "offsetY",
                    max: height,
                    min: -height / 2,
                    df: gradient.offsetY,
                  },
                ].map((offset, i) => (
                  <div key={i} className="flex flex-col ghap-2">
                    <span>{offset.label}</span>
                    <RadialPropertyChange
                      min={offset.min}
                      color={gradient}
                      defaultVal={offset.df}
                      fn={(v) => {
                        if (!canvasC?.current || gradient == null) return;
                        const newG: Gradient<GradientType> = new Gradient({
                          colorStops: gradient.colorStops,
                          offsetY: gradient.offsetY,
                          type: gradient.type,
                          coords: gradient.coords,
                        });
                        if (offset.prop == "offsetX") {
                          newG.offsetX = v;
                        } else {
                          newG.offsetY = v;
                        }
                        if (forCanvas) {
                          canvasC.current.changeCanvasColor(newG);
                        } else if (activeObject) {
                          canvasC.current.changeCanvasProperties(activeObject, {
                            fill: newG,
                          });
                        }
                        setFabricObject(activeObject);
                      }}
                      max={offset.max}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function RadialPropertyChange({
  fn,
  max,
  defaultVal,
  min = 0,
}: {
  min?: number;
  defaultVal: number;
  max: number;
  fn: (e: number) => void;
  color: Gradient<GradientType>;
}) {
  return (
    <Slider
      onValueChange={debouncer((e) => {
        fn(e[0]);
      }, 10)}
      defaultValue={[defaultVal || 0]}
      max={max}
      min={min}
      step={2}
    />
  );
}
export default ColorOptions;
