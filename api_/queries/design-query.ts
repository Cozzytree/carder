import { useQuery } from "@tanstack/react-query";
import conf from "../conf";
import { handler } from "@/lib/utils";
import type { Design } from "../types";

const useGetUserDesigns = (token?: string) => {
   const { data: userDesigns, isFetching: fetchingDesigns } = useQuery<{
      data: Design[];
      status: number;
   } | null>({
      queryKey: ["user-designs"],
      queryFn: handler(async () => {
         const res = await fetch(`${conf.api_url}/design`, {
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token === undefined ? "" : token}`,
            },
            method: "GET",
         });

         if (res.status >= 400) {
            throw new Error(res.statusText || "unknown error");
         }

         if (res.headers.get("Content-Type") === "application/json") {
            return res.json();
         }

         return null;
      }),
   });

   return { userDesigns, fetchingDesigns };
};

const useGetDesignById = ({ id, token }: { token?: string; id: string }) => {
   const { data: design, isFetching: fetchingDesign } = useQuery({
      queryKey: ["user-designs"],
      queryFn: handler(async () => {
         const res = await fetch(`${conf.api_url}/design/${id}`, {
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            method: "GET",
         });

         if (res.status >= 400) {
            throw new Error(res.statusText || "unknown error");
         }

         if (res.headers.get("Content-Type") === "application/json") {
            return res.json();
         }

         return null;
      }),
   });

   return { design, fetchingDesign };
};

export { useGetUserDesigns, useGetDesignById };
