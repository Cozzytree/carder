"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
   const isMobile = useIsMobile();

   return (
      <>
         <div className="w-full flex items-center justify-between">
            <div>{isMobile && <SidebarTrigger />}</div>
         </div>
      </>
   );
};

export default Header;
