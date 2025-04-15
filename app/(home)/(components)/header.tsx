"use client";

import UserInfo from "@/components/user_info";

// import { useCurrentUser } from "@/api_/queries/user-query";
import type { User } from "@/api_/types";

type props = {
   user: User;
};

const Header = ({ user }: props) => {
   return (
      <div className="w-full flex items-center justify-between">
         <div></div>

         <UserInfo loading={false} user={user} />
      </div>
   );
};

export default Header;
