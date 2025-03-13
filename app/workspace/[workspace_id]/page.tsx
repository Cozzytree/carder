import { createApi } from "unsplash-js";
import EditorWrapper from "./canvas/components/editor-wrapper";
import { auth } from "@/auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

// const dbName = "carder_db";
// const db_version = 5;

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESSKEY || "",
});

const getPhotos = async () => {
  const p = await unsplash.photos.getRandom({
    count: 5,
    query: "design",
  });
  console.log(p);
};

export default async function Page() {
  const session = await auth();

  return (
    <SidebarProvider>
      <AppSidebar userSession={session} />
      <div className="w-full border-l border-foreground/50 overflow-hidden h-screen flex flex-col">
        <EditorWrapper />
      </div>
    </SidebarProvider>
  );
}
