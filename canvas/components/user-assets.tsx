import { useGetDesignImages } from "@/api_/queries/image-query";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

type Props = {
   onChange: (e: string) => void;
};

export default function UserAssets({}: Props) {
   const params = useParams();
   const { designImages, loadingImages } = useGetDesignImages((params?.editor_Id as string) || "");

   if (loadingImages) {
      return (
         <div className="w-full flex justify-center">
            <LoaderCircleIcon className="animate-spin" />
         </div>
      );
   }

   return (
      <div className="w-full">
         <div className="grid grid-cols px-2">
            {designImages?.data?.map((img, i) => (
               <button key={i}>
                  <Image
                     src={img?.image_url}
                     alt={img?.image_url}
                     width={100}
                     height={100}
                     className="w-full h-full rounded-md"
                  />
               </button>
            ))}
         </div>
      </div>
   );
}
