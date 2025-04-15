import Link from "next/link";

import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";

async function Page() {
  const session = await auth();
  const user = session?.user;

  if (!user) redirect("/");

  const designs = await preloadQuery(api.designs.getDesigns, {
    email: user.email || "",
  });

  return (
    <div className="sm:container mx-auto p-3 space-y-2">
      <div className="sticky top-0 w-full flex items-center gap-3">
        <SidebarTrigger />
        {/* <CurrPath /> */}
        <h1 className="font-semibold text-lg">Designs</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        {Array.isArray(designs._valueJSON) &&
          designs._valueJSON.map(
            (
              d: {
                _id: Id<"designs">;
                _creationTime: number;
                description?: string | undefined;
                owner_id: Id<"users">;
                name: string;
                url: string;
              },
              i,
            ) => (
              <Link key={i} href={`/design/${d._id}`}>
                <Card className="p-2 shadow-lg h-24">
                  <CardContent className="space-y-2">
                    <CardTitle>{d.name}</CardTitle>
                    <CardDescription>{d.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ),
          )}
      </div>
    </div>
  );
}

export default Page;
