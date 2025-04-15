import Header from "./(components)/header";
import DesignList from "./(components)/design-list";
import { Separator } from "@/components/ui/separator";
import { MySidebarProvider } from "./(components)/my_sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@/api_/types";
import conf from "@/api_/conf";

export default async function Home() {
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
      <MySidebarProvider>
         <div className="h-full w-full mx-auto px-2 md:px-5 py-2">
            <div className="w-full flex justify-between">
               <Header user={data?.data} />
            </div>

            <div>
               <h1 className="text-3xl font-bold">Recents</h1>
               <Separator className="my-2" />

               <DesignList user={data?.data} />
            </div>
         </div>
      </MySidebarProvider>
   );
}
