import { handler } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import conf from "../conf";

const useCreateShape = () => {
   const { mutate: createShape, isLoading: isCreating } = useMutation({
      mutationFn: handler(
         async (d: {
            data: {
               id: string;
               props: string;
            }[];
            id: string;
         }) => {
            const res = await fetch(`${conf.api_url}/shape/create/${d.id}`, {
               credentials: "include",
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({ shapes: d.data }),
            });

            if (res.status >= 400) {
               throw new Error((await res.text()) || "Unknown error");
            }
            return await res.text();
         },
      ),
   });

   return {
      createShape,
      isCreating,
   };
};

const useUpdateShape = () => {
   const { mutate: updateShape, isLoading: isUpdating } = useMutation({
      mutationFn: handler(
         async (d: {
            data: {
               id: string;
               props: string;
            }[];
         }) => {
            const res = await fetch(`${conf.api_url}/shape/update`, {
               credentials: "include",
               method: "PATCH",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({ shapes: d.data }),
            });

            if (res.status >= 400) {
               throw new Error((await res.text()) || "Unknown error");
            }
            return await res.text();
         },
      ),
      onSuccess: () => {},
   });

   return {
      updateShape,
      isUpdating,
   };
};

const useDeleteShape = () => {
   const { mutate: deleteShape, isLoading: isDeleting } = useMutation({
      mutationFn: handler(async (d: { data: string[] }) => {
         const res = await fetch(`${conf.api_url}/shape/delete`, {
            credentials: "include",
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ shapes: d.data }),
         });

         if (res.status >= 400) {
            throw new Error((await res.text()) || "Unknown error");
         }
         return await res.text();
      }),
   });

   return {
      deleteShape,
      isDeleting,
   };
};

export { useCreateShape, useUpdateShape, useDeleteShape };
