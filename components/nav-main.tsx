"use client";

import { PlusCircle, type LucideIcon } from "lucide-react";
import { SidebarGroup, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function NavMain({
   items,
}: {
   items: {
      title: string;
      url: string;
      icon?: LucideIcon;
      isActive?: boolean;
      items?: {
         title: string;
         url: string;
      }[];
   }[];
}) {
   const router = useRouter();

   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");

   return (
      <SidebarGroup>
         <SidebarMenu className="gap-0">
            <Dialog>
               <DialogTrigger asChild>
                  <SidebarMenuItem>
                     <Button variant={"secondary"} className="w-full mb-3 rounded-full" size={"sm"}>
                        <PlusCircle />
                        Create Design
                     </Button>
                  </SidebarMenuItem>
               </DialogTrigger>
               <DialogContent>
                  <DialogTitle>Create Design</DialogTitle>
                  <div className="flex flex-col gap-2">
                     <Input
                        onChange={(e) => {
                           setTitle(e.target.value);
                        }}
                        placeholder="Title"
                        className="p-2"
                     />
                     <textarea
                        className="outline-hidden focus:ring-2 ring-primary p-2 bg-transparent rounded-3xl max-h-16"
                        placeholder="Description"
                        onChange={(e) => {
                           setDescription(e.target.value);
                        }}
                     />
                  </div>

                  <DialogFooter>
                     <Button size={"sm"} variant={"default"}>
                        create design
                     </Button>
                  </DialogFooter>
               </DialogContent>
            </Dialog>

            {items.map((item) => (
               <SidebarMenuItem key={item.url}>
                  <Button
                     size={"xs"}
                     variant={"simple"}
                     className={`w-full flex items-center h-fit`}
                  >
                     <Link href={item.url} className={`w-full flex items-center gap-2`}>
                        {item.icon && (
                           <item.icon className={`${item.isActive && "text-secondary"} w-5 h-5`} />
                        )}
                        <span
                           className={`${item.isActive && "rounded-full bg-secondary/20"} p-2 w-full`}
                        >
                           {item.title}
                        </span>
                     </Link>
                  </Button>
               </SidebarMenuItem>
            ))}
         </SidebarMenu>
      </SidebarGroup>
   );
}
