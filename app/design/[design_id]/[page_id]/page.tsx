import EditorContainer from "../../components/editor_container";

import type { Design_Page } from "@/lib/types";

import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";

async function Page({
  params,
}: {
  params: { page_id: Id<"designs_page">; design_id: Id<"designs"> };
}) {
  const { page_id } = await params;

  const design = await preloadQuery(api.designs.getAdesign, {
    design_id: page_id,
  });
  if (!design._valueJSON) {
    redirect(`/`);
  }

  const d = design._valueJSON as Design_Page;

  const response = await preloadQuery(api.shapes.getShapes, {
    design_page_id: d?._id,
  });

  let shapes: {
    _creationTime: number;
    _id: string;
    design_page_id: string;
    props: string;
    shape_id: string;
  }[] = [];
  if (Array.isArray(response._valueJSON)) {
    if (response._valueJSON.length) {
      shapes = response._valueJSON as {
        _creationTime: number;
        _id: string;
        design_page_id: string;
        props: string;
        shape_id: string;
      }[];
    }
  }

  return (
    <div className="w-full flex flex-1 h-screen">
      <EditorContainer design_page={d} shapes={shapes} page_id={page_id} />
    </div>
  );
}

export default Page;
