"use client";

import type { User } from "@/api_/types";
import { useGetUserDesigns } from "@/api_/queries/design-query";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { dateFormat } from "@/lib/utils";
import Link from "next/link";

type props = {
   user?: User;
};

const DesignList = ({}: props) => {
   const { fetchingDesigns, userDesigns } = useGetUserDesigns();

   if (fetchingDesigns) {
      return <Skeleton className="w-full h-20"></Skeleton>;
   }

   return (
      <div>
         {userDesigns?.data?.map((d, i) => (
            <Link
               href={`/editor/${d?.id}`}
               key={i}
               className={`${buttonVariants({ variant: "simple", size: "sm" })} flex flex-col items-start`}
            >
               <div>
                  <h2 className="font-semibold">{d?.name}</h2>

                  <p className="text-sm">{d?.description}</p>
               </div>
               <span
                  className={`${buttonVariants({ variant: "simple", size: "xs" })}`}
               >
                  {dateFormat(d?.created_at)}
               </span>
            </Link>
         ))}
      </div>
   );
};

export default DesignList;
