import { handler } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import conf from "../conf";
import type { UserImage } from "../types";

const useUploadImage = () => {
   const { isLoading: uploadingImage, mutate: uploadImage } = useMutation({
      mutationFn: handler(async (d: { design_id: string; f: FormData }) => {
         const res = await fetch(`${conf.api_url}/image/upload/${d.design_id}`, {
            credentials: "include",
            method: "POST",
            body: d.f,
         });

         if (res.status >= 400) {
            throw new Error((await res.text()) || "An error occurred");
         }

         const data = await res.json();
         return data as { data: UserImage; status: number } | null;
      }),
   });

   return { uploadingImage, uploadImage };
};

export { useUploadImage };
