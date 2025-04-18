import DesignList from "./(components)/design-list";

import { Separator } from "@/components/ui/separator";
import EditorOptions from "./(components)/editor_options";

export default async function Home() {
   return (
      <div className="h-full w-full mx-auto px-2 md:px-5 py-2">
         <EditorOptions />

         <Separator className="my-4" />

         <div>
            <h1 className="text-3xl font-bold">Recents</h1>
            <Separator className="my-2" />

            <DesignList />
         </div>
      </div>
   );
}
