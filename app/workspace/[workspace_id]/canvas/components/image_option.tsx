"use client";

import CanvasC from "../canvas";
import programming from "../data/shapes/programming.json";
import emojis from "../data/shapes/emoji.json";
import NextImage from "next/image";

import { PlusCircle } from "lucide-react";
import { RefObject } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type props = {
  canvasC: RefObject<CanvasC | null>;
};

const tabs = ["programming", "emoji", "biology", "others"];

function ImageOption({ canvasC }: props) {
  const handleImage = (f: File) => {
    if (!f || !canvasC.current) return;
    const i = new Image();

    const reader = new FileReader();
    reader.onload = async (e) => {
      const res = e.target?.result;
      if (!res) return;
      i.src = res as string;
      await canvasC.current?.createNewImage(res as string);
    };
    reader.readAsDataURL(f);
  };
  const handleImageElement = async (f: string) => {
    if (!f || !canvasC.current) return;
    await canvasC.current?.createNewImage(f);
  };

  return (
    <div className="w-full flex flex-col px-2 overflow-y-auto">
      <label
        htmlFor="image-local"
        className="text-sm cursor-pointer flex items-center gap-2"
      >
        Local
        <PlusCircle className="w-5 h-5 border" />
      </label>
      <input
        onChange={(e) => {
          if (e.target.files) {
            handleImage(e.target.files[0]);
          }
        }}
        type="file"
        id="image-local"
        className="hidden"
        multiple={false}
        accept=".png,.jpg,.svg"
      />
      <div className="flex flex-col gap-2">
        <Tabs defaultValue="programming">
          <TabsList asChild>
            <div className="flex flex-wrap h-fit sticky top-0">
              {tabs.map((t, i) => (
                <TabsTrigger value={t} key={i}>
                  {t}
                </TabsTrigger>
              ))}
            </div>
          </TabsList>
          <TabsContent value="programming" asChild>
            <div className="grid grid-cols-4 md:grid-cols-2 place-items-center">
              {programming.icons.map((p, i) => (
                <div
                  onClick={() => {
                    handleImageElement(p.url);
                  }}
                  key={i}
                  className="w-full h-full flex justify-center p-2 items-center hover:bg-foreground/10 rounded-md cursor-pointer"
                >
                  <NextImage
                    className="w-14 h-14"
                    src={p.url}
                    width={100}
                    height={100}
                    alt={p.label}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="emoji" asChild>
            <div className="grid grid-cols-4 md:grid-cols-2 place-items-center">
              {emojis.icons.map((e, i) => (
                <div
                  onClick={() => {
                    handleImageElement(e.url);
                  }}
                  key={i}
                  className="w-full h-full flex justify-center p-2 items-center hover:bg-foreground/10 rounded-md cursor-pointer"
                >
                  <NextImage
                    className="w-14 h-14"
                    src={e.url}
                    alt={e.label}
                    width={100}
                    height={100}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ImageOption;
