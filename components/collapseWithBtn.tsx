import { MinusIcon, PlusIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

export default function CollapceWithBtn({
   children,
   label,
   classname,
}: {
   classname?: string;
   label: string;
   children: React.ReactNode;
}) {
   return (
      <Collapsible>
         <CollapsibleTrigger
            className={cn(classname, "w-full group/collapsible flex items-center justify-between")}
         >
            <span className="font-semibold">{label}</span>
            <PlusIcon width={20} className="ml-auto group-data-[state=open]/collapsible:hidden" />
            <MinusIcon
               width={20}
               className="ml-auto group-data-[state=closed]/collapsible:hidden"
            />
         </CollapsibleTrigger>
         <CollapsibleContent>
            {children}
            <Separator className="bg-muted-foreground/20 my-2" />
         </CollapsibleContent>
      </Collapsible>
   );
}
