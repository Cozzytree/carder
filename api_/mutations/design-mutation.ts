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
      mutationFn: handler(async (d: { id: string }) => {
         const res = await fetch(`${conf.api_url}/design/delete/${d.id}`, {
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
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

const useUpdateDesign = () => {
   const { mutate: updateDesign, isLoading: isUpdatingDesign } = useMutation({
      mutationFn: handler(
         async ({
            id,
            props,
         }: {
            id: string;
            props: { width: number; height: number; background: string };
         }) => {
            const res = await fetch(`${conf.api_url}/design/update/${id}`, {
               credentials: "include",
               method: "PATCH",
               body: JSON.stringify(props),
            });
            if (res?.status >= 400) {
               throw new Error(res.statusText || "internal server error");
            }
            return res.statusText;
         },
      ),
   });
   return { updateDesign, isUpdatingDesign };
};

export { useCreateDesign, useDeleteDesign, useUpdateDesign };
