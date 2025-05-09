import type { User } from "@/api_/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "./ui/skeleton";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import conf from "@/api_/conf";
import { redirect } from "next/navigation";

type props = {
   user?: User;
   loading: boolean;
};

async function logout() {
   const res = await fetch(`${conf.api_url}/logout`, {
      credentials: "include",
   });
   if (res.status >= 400) {
      return { success: false };
   }
   return null;
}

const UserInfo = ({ loading, user }: props) => {
   return (
      <div className="flex items-center gap-1">
         {loading ? (
            <Skeleton className="w-8 h-8 rounded-full" />
         ) : (
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button size={"sm"} variant={"simple"}>
                     <Avatar>
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>{user?.name ? user?.name[0] : ""}</AvatarFallback>
                     </Avatar>
                     <p className="hidden md:block font-semibold">{user?.name}</p>
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent>
                  <DropdownMenuItem
                     onClick={() => {
                        logout().then((d) => {
                           if (d === null) {
                              redirect("/landing");
                           }
                        });
                     }}
                  >
                     Log out
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         )}
      </div>
   );
};

export default UserInfo;
