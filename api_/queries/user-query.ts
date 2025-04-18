import { handler } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { User } from "../types";

import conf from "../conf";

const useCurrentUser = () => {
   const {
      data: currUser,
      isFetching: fetchingCurrUser,
      error: fetchUserError,
   } = useQuery<{ data: User; status: number } | null>({
      queryFn: handler(async () => {
         const res = await fetch(`${conf.api_url}/user`, {
            method: "GET",
            credentials: "include",
         });

         if (res.status >= 400) {
            const message = `Error ${res.status}: ${res.statusText}`;
            throw message;
         }

         if (res.headers.get("Content-Type") === "application/json") {
            return res.json();
         }

         return null;
      }),
      queryKey: ["user"],
      onError: (e) => {
         // console.log(e);
      },
   });
   return {
      currUser,
      fetchingCurrUser,
      fetchUserError,
   };
};

export { useCurrentUser };
