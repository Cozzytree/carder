"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Page() {
  const { data } = useSession();

  const workspaces = useQuery(api.workspace.getUserWorkspaces, {
    email: data?.user?.email || "",
  });

  return (
    <div className="h-full w-full md:p-10 py-7 px-5">
      <h3 className="text-2xl font-semibold mb-3">Projects</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Array.isArray(workspaces) &&
          workspaces?.map((w, i) => (
            <Link key={i} href={`/design/${w._id}`}>
              <Card>
                <CardHeader>
                  <CardTitle>{w?.title}</CardTitle>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
}
