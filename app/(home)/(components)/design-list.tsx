"use client";

import Link from "next/link";
import Image from "next/image";
import type { User } from "@/api_/types";
import { useGetUserDesigns } from "@/api_/queries/design-query";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { dateFormat } from "@/lib/utils";
import { useUserContext } from "@/hooks/use_user";
import { useDeleteDesign } from "@/api_/mutations/design-mutation";
import { EllipsisIcon, XIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogHeader,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { useGetDesignShapes } from "@/api_/queries/shape-query";
import { Canvas } from "fabric";
import EditorWrapper from "@/canvas/components/editor-wrapper";

const DesignList = () => {
   const {} = useUserContext();
   const [isDelId, setDelId] = useState<string | null>(null);
   const { deleteDesign, deletingDesign } = useDeleteDesign();
   const { fetchingDesigns, userDesigns } = useGetUserDesigns();

   if (fetchingDesigns) {
      return <Skeleton className="w-full h-20"></Skeleton>;
   }

   return (
      <>
         <Dialog
            open={isDelId ? true : false}
            onOpenChange={() => {
               setDelId(null);
            }}
         >
            <DialogContent>
               <DialogHeader>Delete Desigm</DialogHeader>
               <DialogFooter>
                  <DialogClose
                     onClick={() => {
                        setDelId(null);
                     }}
                  >
                     close
                  </DialogClose>
                  <Button
                     onClick={() => {
                        if (!isDelId) return;
                        deleteDesign(
                           {
                              id: isDelId,
                           },
                           {
                              onSuccess: () => {
                                 setDelId(null);
                              },
                           },
                        );
                     }}
                     disabled={deletingDesign}
                  >
                     Delete
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {userDesigns?.data?.map((d, i) => (
               <div
                  className={`${buttonVariants({ variant: "simple", size: "sm" })} w-full h-fit relative group p-2`}
                  key={i}
               >
                  <Popover>
                     <PopoverTrigger asChild>
                        <button className="absolute top-3 right-2 opacity-100 md:opacity-0 group-hover:opacity-100">
                           <EllipsisIcon />
                        </button>
                     </PopoverTrigger>
                     <PopoverContent className="w-fit p-1">
                        <Button
                           onClick={() => {
                              setDelId(d.id);
                           }}
                           size={"sm"}
                           variant={"simple"}
                        >
                           Delete
                        </Button>
                     </PopoverContent>
                  </Popover>

                  <Link href={`/editor/${d?.id}`} className="flex flex-col items-start">
                     <div className="w-full flex justify-center">
                        <Image src={"./empty_image.svg"} alt="empty" width={100} height={100} />
                        {/* <Preview id={d.id} /> */}
                     </div>

                     <div>
                        <h2 className="font-semibold">{d?.name}</h2>

                        <p className="text-xs">{d?.description}</p>
                     </div>
                     <span className={`${buttonVariants({ variant: "simple", size: "xs" })}`}>
                        {dateFormat(d?.created_at)}
                     </span>
                  </Link>
               </div>
            ))}
         </div>
      </>
   );
};

function Preview({ id }: { id: string }) {
   const { isFetchingShapes, shapes } = useGetDesignShapes(id);
   const canvasRef = useRef<HTMLCanvasElement | null>(null);

   return (
      <EditorWrapper
         initialData={{
            width: 500,
            height: 500,
            scale: 0.1,
            shapes: shapes?.data || [],
         }}
         editable={false}
         showUploads={false}
      />
   );
}

export default DesignList;
