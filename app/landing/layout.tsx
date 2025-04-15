import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="min-h-screen w-full">
         <div className="w-full h-full flex flex-1">{children}</div>
      </div>
   );
};
export default Layout;
