import { handler } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import conf from "../conf";

const useCreateDesign = () => {
   const q = useQueryClient();
   const { mutate: createDesign, isLoading: creatingDesign } = useMutation({
      mutationFn: handler(
         async (d: {
            token?: string;
            name: string;
            description?: string;
            width: number;
            height: number;
            category?: string;
         }) => {
            const { height, name, token, width, category, description } = d;
            const res = await fetch(`${conf.api_url}/design/create`, {
               credentials: "include",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
               method: "POST",
               body: JSON.stringify({
                  name,
                  description,
                  width,
                  height,
                  category,
               }),
            });

            if (res.status >= 400) {
               throw new Error(res.statusText || "unknown error");
            }

            if (res.headers.get("Content-Type") === "application/json") {
               return res.json();
            }

            return null;
         },
      ),
      onSuccess: () => {
         q.invalidateQueries({ queryKey: ["user-designs"] });
      },
   });

   return { createDesign, creatingDesign };
};

const useDeleteDesign = () => {
   const { mutate: deleteDesign, isLoading: deletingDesign } = useMutation({
      mutationFn: handler(async (d: { token?: string; id: string }) => {
         const res = await fetch(`${conf.api_url}/design/delete/${d.id}`, {
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${d?.token || ""}`,
            },
            method: "DELETE",
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

   return { deleteDesign, deletingDesign };
};

export { useCreateDesign, useDeleteDesign };
