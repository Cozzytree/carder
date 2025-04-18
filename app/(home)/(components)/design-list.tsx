"use client";

import type { User } from "@/api_/types";
import { useGetUserDesigns } from "@/api_/queries/design-query";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { dateFormat } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useUserContext } from "@/hooks/use_user";

const DesignList = () => {
   const {} = useUserContext();
   const { fetchingDesigns, userDesigns } = useGetUserDesigns();

   if (fetchingDesigns) {
      return <Skeleton className="w-full h-20"></Skeleton>;
   }

   return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
         {userDesigns?.data?.map((d, i) => (
            <Link href={`/editor/${d?.id}`} key={i} className={`${buttonVariants({ variant: "simple", size: "sm" })} flex flex-col justify-between items-start p-2`}>
               <div className="w-full flex justify-center">
                  <Image src={"./empty_image.svg"} alt="empty" width={100} height={100} />
               </div>

               <div>
                  <h2 className="font-semibold">{d?.name}</h2>

                  <p className="text-sm">{d?.description}</p>
               </div>
               <span className={`${buttonVariants({ variant: "simple", size: "xs" })}`}>{dateFormat(d?.created_at)}</span>
            </Link>
         ))}
      </div>
   );
};

export default DesignList;
