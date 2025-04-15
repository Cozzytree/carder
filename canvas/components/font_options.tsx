import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { debouncer } from "@/lib/utils";
import {
  ItalicIcon,
  LucideUnderline,
  TypeIcon,
  WeightIcon,
} from "lucide-react";
import { RefObject } from "react";
import CanvasC from "../canvas";
import { aligns, fontweights, textjustify } from "../constants";
import fonts from "../data/fonts.json";
import { useCanvasStore } from "../store";
import { Align } from "../types";
import { Input } from "@/components/ui/input";

type props = {
  canvasC: RefObject<CanvasC | null>;
};

function FontOptions({ canvasC }: props) {
  const activeObject = useCanvasStore((state) => state.activeObject);
  const setFabricObject = useCanvasStore((state) => state.setFabricObject);

  const fontconf = {
    size: activeObject?.get("fontSize"),
    family: activeObject?.get("fontFamily"),
    style: activeObject?.get("fontStyle"),
    underline: activeObject?.get("underline"),
    weight: activeObject?.get("fontWeight"),
    align: activeObject?.get("textAlign"),
  };

  const handleFont_family = async (name: string, url: string) => {
    if (!canvasC.current || !activeObject) return;
    if (await canvasC.current.addNewFont(name, url)) {
      canvasC.current?.changeCanvasProperties(activeObject, {
        fontFamily: name,
      });
      setFabricObject(activeObject);
    }
  };
  const handleFont_Size = (v: number) => {
    if (!canvasC.current || !activeObject) return;
    canvasC.current.changeCanvasProperties(activeObject, { fontSize: v });
    setFabricObject(activeObject);
  };

  const handleFontStyle = (t: string) => {
    if (!canvasC.current || !activeObject) return;
    canvasC.current.changeCanvasProperties(activeObject, { fontStyle: t });
    setFabricObject(activeObject);
  };

  const handleUnderLine = () => {
    if (!canvasC.current || !activeObject) return;
    canvasC.current.changeCanvasProperties(activeObject, {
      underline: fontconf.underline ? false : true,
    });
    setFabricObject(activeObject);
  };

  const handleTextAlign = (v: Align) => {
    if (!canvasC.current || !activeObject) return;
    canvasC.current.changeCanvasProperties(activeObject, { textAlign: v });
    setFabricObject(activeObject);
  };

  const handleWeight = (v: number) => {
    if (!canvasC.current || !activeObject) return;
    canvasC.current.changeCanvasProperties(activeObject, { fontWeight: v });
    setFabricObject(activeObject);
  };

  return (
    <div className="flex gap-1 justify-center items-center">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <TypeIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col gap-1 w-32">
          <div className="flex items-center gap-2">
            {/* {font weights} */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <WeightIcon />
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <div className="flex flex-col w-6 text-sm">
                  {fontweights.map((w, i) => (
                    <Button
                      onClick={() => {
                        handleWeight(w);
                      }}
                      size="xs"
                      variant={"outline"}
                      className="w-6 h-6"
                      key={i}
                    >
                      {w}
                    </Button>
                  ))}
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <Button
              onClick={() => {
                handleUnderLine();
              }}
              size={"xs"}
              variant={fontconf.underline ? "default" : "outline"}
            >
              <LucideUnderline />
            </Button>
            <Button
              onClick={() => {
                if (fontconf.style === "italic") {
                  handleFontStyle("normal");
                } else {
                  handleFontStyle("italic");
                }
              }}
              size={"xs"}
              variant={fontconf.style === "italic" ? "default" : "outline"}
            >
              <ItalicIcon />
            </Button>
          </div>

          {/* {text alligns} */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-sm">
              Text Align
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="flex flex-col gap-1 items-center">
              <div>
                <DropdownMenuLabel>Align</DropdownMenuLabel>
                {aligns.map((a, i) => (
                  <Button
                    onClick={() => {
                      handleTextAlign(a.label);
                    }}
                    size={"xs"}
                    variant={fontconf.align === a.label ? "default" : "outline"}
                    key={i}
                  >
                    <a.I />
                  </Button>
                ))}
              </div>
              <div>
                <DropdownMenuLabel>Justify</DropdownMenuLabel>
                {textjustify.map((a, i) => (
                  <Button
                    onClick={() => {
                      handleTextAlign(a.label);
                    }}
                    size={"xs"}
                    variant={fontconf.align === a.label ? "default" : "outline"}
                    key={i}
                  >
                    <a.I />
                  </Button>
                ))}
                I
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>{fontconf.family}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="flex flex-col gap-0">
              {fonts.fonts.map((f, i) => (
                <Button
                  onClick={() => {
                    handleFont_family(f.label, f.url);
                  }}
                  className={`${f.label === fontconf.family && "bg-secondary border border-foreground"}`}
                  size={"xs"}
                  variant={"outline"}
                  key={i}
                >
                  {f.label}
                </Button>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <Input
            className="w-full"
            type="number"
            defaultValue={fontconf.size}
            onChange={debouncer((e: React.ChangeEvent<HTMLInputElement>) => {
              const v = parseInt(e.target.value);
              if (v < 0) return;
              handleFont_Size(v);
            }, 20)}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default FontOptions;
