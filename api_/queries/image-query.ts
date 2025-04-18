import { handler } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import conf from "../conf";
import { UserImage } from "../types";

const useGetDesignImages = (id: string) => {
   const { data: designImages, isFetching: loadingImages } = useQuery({
      queryFn: handler(async () => {
         const res = await fetch(`${conf.api_url}/image/design/${id}`, {
            method: "GET",
            credentials: "include",
         });

         if (res.status >= 400) {
            throw new Error(res?.statusText || "Failed to fetch design images");
         }

         if (res.headers.get("Content-Type")?.includes("application/json")) {
            return (await res.json()) as { data: UserImage[]; status: number };
         }

         throw new Error("Failed to fetch design images");
      }),
      queryKey: ["design-images"],
   });
   return { designImages, loadingImages };
};

export { useGetDesignImages };
