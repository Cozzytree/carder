"use client";

import CanvasC from "../canvas";
import programming from "../data/shapes/programming.json";
import emojis from "../data/shapes/emoji.json";
import NextImage from "next/image";

import { PlusCircle } from "lucide-react";
import { RefObject, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUploadImage } from "@/api_/mutations/image-mutation";
import { useParams } from "next/navigation";

type props = {
   canvasC: RefObject<CanvasC | null>;
};

const tabs = ["programming", "emoji", "others"];

function ImageOption({ canvasC }: props) {
   const params = useParams();
   const { uploadImage, uploadingImage } = useUploadImage();
   const [currTab, setCurrTab] = useState("programming");

   const handleImage = (f: File) => {
      if (!f || !canvasC.current) return;

      const design_id = params?.editor_Id as string;
      if (!design_id) return;

      const formData = new FormData();
      formData.append("carder-image", f);

      uploadImage(
         { design_id, f: formData },
         {
            onSuccess: (v) => {
               if (!v?.data?.image_url) return;
               canvasC.current?.createNewImage(v?.data?.image_url);
            },
         },
      );
   };

   const handleImageElement = async (f: string) => {
      if (!f || !canvasC.current) return;
      await canvasC.current?.createNewImage(f);
   };

   return (
      <div className="h-full w-full flex flex-col gap-2">
         {uploadingImage && <p>uploading</p>}
         <label htmlFor="image-local" className="text-sm cursor-pointer flex items-center gap-2 px-3">
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
         <div className="h-full flex flex-col gap-2">
            <div>
               {tabs.map((t, i) => (
                  <Button
                     key={i}
                     onClick={() => {
                        setCurrTab(t);
                     }}
                     size={"xs"}
                     variant={"outline"}
                     className={`${currTab === t && "bg-accent/30"}`}
                  >
                     {t}
                  </Button>
               ))}
            </div>
            <div className="grid grid-cols-2 overflow-y-auto">
               {currTab === "programming" && (
                  <>
                     {programming.icons.map((p, i) => (
                        <div
                           onClick={() => {
                              handleImageElement(p.url);
                           }}
                           key={i}
                           className="w-full flex justify-center p-2 items-center hover:bg-foreground/10 cursor-pointer"
                        >
                           <NextImage className="w-10 h-10" src={p.url} width={100} height={100} alt={p.label} quality={40} />
                        </div>
                     ))}
                  </>
               )}
               {currTab === "emoji" && (
                  <>
                     {emojis.icons.map((e, i) => (
                        <div
                           onClick={() => {
                              handleImageElement(e.url);
                           }}
                           key={i}
                           className="w-full h-full flex justify-center p-2 items-center hover:bg-foreground/10 cursor-pointer"
                        >
                           <NextImage className="w-10 h-10" src={e.url} alt={e.label} width={100} height={100} />
                        </div>
                     ))}
                  </>
               )}
            </div>
         </div>
      </div>
   );
}

export default ImageOption;
