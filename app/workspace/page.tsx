import { auth } from "@/auth";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if (!session?.user) redirect("/");

  const workspaces = await preloadQuery(api.workspace.getUserWorkspaces, {
    email: session.user.email || "",
  });

  return <div></div>;
}
