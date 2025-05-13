import type { User } from "@/api_/types";

import conf from "@/api_/conf";
import Header from "./(components)/header";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserContextProvider } from "@/hooks/use_user";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const cookie = await cookies();

   const session = cookie.get(process.env.NEXT_PUBLIC_SESSION_NAME || "");

   if (!session || !session?.value) {
      redirect("/landing");
   }

   const res = await fetch(`${conf.api_url}/user`, {
      headers: {
         Authorization: `Bearer ${session?.value}`,
      },
   });

   if (res.status >= 400) {
      redirect(`/error/${res?.statusText || "internal server error"}`);
   }

   const data = (await res.json()) as { data: User };

   return (
      // <MySidebarProvider>
      <UserContextProvider user={data?.data}>
         <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <div className="h-full w-full mx-auto px-2 md:px-5 py-2">
               <div className="w-full flex justify-between">
                  <Header />
               </div>
               {children}
            </div>
         </SidebarProvider>
      </UserContextProvider>
      // </MySidebarProvider>
   );
}
