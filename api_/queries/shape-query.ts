import { handler } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import conf from "../conf";
import type { Shapes } from "../types";

const useGetDesignShapes = (design_id: string) => {
   const { data: shapes, isFetching: isFetchingShapes } = useQuery<{ data: Shapes[]; status: number } | null>({
      queryFn: handler(async () => {
         const response = await fetch(`${conf.api_url}/shape/${design_id}`, {
            credentials: "include",
         });

         if (response?.status >= 400) {
            throw new Error(response?.statusText || "Failed to fetch shapes");
         }

         const data = await response.json();
         return data;
      }),
      queryKey: [`design-${design_id}`],
      refetchOnMount: false,
      cacheTime: 1000,
   });
   return { shapes, isFetchingShapes };
};

export { useGetDesignShapes };
