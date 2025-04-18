import conf from "@/api_/conf";
import Editor from "../(components)/editor";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Design, Shapes } from "@/api_/types";

type props = {
   params: { editor_Id: string };
};

const EditorPage = async ({ params }: props) => {
   const { editor_Id } = await params;

   const cookie = await cookies();

   const session = cookie.get(conf?.session || "");

   if (!session) {
      redirect("/landing");
   }

   const res = await fetch(`${conf?.api_url}/design/${editor_Id}`, {
      method: "GET",
      headers: {
         Authorization: `Bearer ${session?.value}`,
      },
   });

   if (res?.status >= 400) {
      redirect(`/error?m=${res?.statusText || "unknown error"}&origin=editor`);
   }

   const data = (await res.json()) as { data: Design; status: number };

   if (!data?.data) {
      redirect("/");
   }

   const shapeRes = await fetch(`${conf?.api_url}/shape/${data?.data?.id}`, {
      method: "GET",
      headers: {
         Authorization: `Bearer ${session?.value}`,
      },
   });

   if (shapeRes?.status >= 400) {
      redirect(`/error?m=${shapeRes?.statusText || "unknown error"}&origin=editor`);
   }

   const shapeData = (await shapeRes.json()) as { data: Shapes[] };

   return (
      <div className="h-screen  w-full">
         <Editor design={data?.data} shapes={shapeData?.data} />
      </div>
   );
};

export default EditorPage;
