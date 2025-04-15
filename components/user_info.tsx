import type { User } from "@/queries/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";

type props = {
   user?: User;
   loading: boolean;
};

const UserInfo = ({ loading, user }: props) => {
   return (
      <div className="flex items-center gap-1">
         {loading ? (
            <Skeleton className="w-8 h-8 rounded-full" />
         ) : (
            <>
               <Avatar>
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>
                     {user?.name ? user?.name[0] : ""}
                  </AvatarFallback>
               </Avatar>
               <p className="hidden md:block">{user?.name}</p>
            </>
         )}
      </div>
   );
};

export default UserInfo;
