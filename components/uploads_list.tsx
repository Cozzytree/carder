import { useGetDesignImages } from "@/api_/queries/image-query";
import { Skeleton } from "./ui/skeleton";
import NextImage from "next/image";

type Props = {
   designId: string;
   onClick?: (img: HTMLImageElement | string) => void;
};

const UploadList = ({ designId, onClick }: Props) => {
   const { designImages, loadingImages } = useGetDesignImages(designId);

   if (loadingImages) {
      return <Skeleton className="h-12 w-full" />;
   }

   return (
      <div className="w-full flex flex-col gap-2 p-1">
         {designImages?.data?.map((img, i) => (
            <div
               key={i}
               className="w-full rounded-md"
               onClick={() => {
                  onClick?.(img?.image_url);
               }}
            >
               <NextImage className="w-[400px]" src={img?.image_url} alt={img?.id} width={100} height={100} />
            </div>
         ))}
      </div>
   );
};

export default UploadList;
