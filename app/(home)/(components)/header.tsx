"use client";

import UserInfo from "@/components/user_info";

// import { useCurrentUser } from "@/api_/queries/user-query";
import { useUserContext } from "@/hooks/use_user";

const Header = () => {
   const { user } = useUserContext();
   return (
      <div className="w-full flex items-center justify-between">
         <div></div>

         <UserInfo loading={false} user={user} />
      </div>
   );
};

export default Header;
