"use client";

import * as React from "react";

import { SidebarOptInForm } from "@/components/sidebar-opt-in-form";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarRail,
} from "@/components/ui/sidebar";
import UserLabel from "./user_label";
import { NavMain } from "./nav-main";
import { Folders, HomeIcon, PlusIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import UserInfo from "./user_info";
import { useUserContext } from "@/hooks/use_user";
import { routes } from "@/lib/utils";
import Link from "next/link";
import { useCreateDesign } from "@/api_/mutations/design-mutation";
import { Button } from "./ui/button";

export function AppSidebar({ props }: { props?: React.ComponentProps<typeof Sidebar> }) {
   const { user } = useUserContext();
   const pathname = usePathname();
   const [name, setName] = React.useState("");
   const [description, setDescription] = React.useState("");

   const { createDesign, creatingDesign } = useCreateDesign();
   const [isOpen, setOpen] = React.useState(false);
   const [isCreateModal, setCreateModal] = React.useState(false);

   const checkPath = (p: string) => {
      return pathname === p;
   };

   const handleDesign = () => {
      createDesign(
         {
            height: 1000,
            width: 1000,
            name,
            token: user?.auth_id,
            category: "instagram",
            description,
         },
         {
            onSuccess: () => {
               setCreateModal(false);
            },
         },
      );
   };

   return (
      <>
         <Dialog open={isCreateModal} onOpenChange={setCreateModal}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Create Design</DialogTitle>
               </DialogHeader>

               <div className="space-y-3">
                  <Input
                     placeholder="name"
                     onChange={(e) => {
                        setName(e.target.value);
                     }}
                  />
                  <Input
                     placeholder="description"
                     onChange={(e) => {
                        setDescription(e.target.value);
                     }}
                  />
               </div>

               <DialogFooter>
                  <DialogClose asChild>
                     <Button disabled={creatingDesign} size={"sm"} variant={"simple"}>
                        close
                     </Button>
                  </DialogClose>

                  <Button
                     disabled={creatingDesign}
                     onClick={() => {
                        handleDesign();
                     }}
                     size={"sm"}
                  >
                     create
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
         <Sidebar {...props}>
            <SidebarHeader>
               <UserInfo loading={false} user={user} />
            </SidebarHeader>

            <Button
               onClick={() => {
                  setCreateModal(true);
               }}
               className="font-semibold mb-5 mx-6"
            >
               Create <PlusIcon />
            </Button>

            <SidebarContent>
               <SidebarMenuItem>
                  {routes.map((r, i) => (
                     <SidebarMenuItem
                        key={i}
                        className={`${checkPath(r.url) ? "text-foreground" : "text-foreground/80"} font-semibold py-1 px-3`}
                     >
                        <Link href={r.url} className="w-full flex items-center gap-3">
                           <r.icon width={20} height={20} /> {r.label}
                        </Link>
                     </SidebarMenuItem>
                  ))}
               </SidebarMenuItem>
            </SidebarContent>
         </Sidebar>
      </>
   );
}
