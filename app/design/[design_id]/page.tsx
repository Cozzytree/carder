import { auth } from "../../../auth";
import { Id } from "@/convex/_generated/dataModel";
import { redirect } from "next/navigation";
import Container from "../components/container";

export default async function Page({
  params,
}: {
  params: { design_id: Id<"designs"> };
}) {
  const { design_id } = await params;

  if (!design_id) return redirect("/signin");

  const session = await auth();
  if (!session?.user) {
    return redirect("/signin");
  }

  return (
    <div>
      <Container designId={design_id} />
    </div>
  );
}
