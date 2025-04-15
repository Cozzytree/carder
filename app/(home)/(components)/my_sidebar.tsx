"use client";

import { useCreateDesign } from "@/api_/mutations/design-mutation";
import { useCurrentUser } from "@/api_/queries/user-query";
import { Button, buttonVariants } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CreditCardIcon, FilesIcon, HomeIcon, PlusCircle } from "lucide-react";
import Link from "next/link";
import React, { createContext, useContext, useState } from "react";

type props = {
   isOpen: boolean;
   setOpen: (v: boolean) => void;
};

const MySidebarContent = createContext<props | undefined>(undefined);

const useSidebarContext = () => {
   const ctx = useContext(MySidebarContent);
   if (!ctx) throw new Error("should be use inside mysidebar");
   return ctx;
};

const routes = [
   { label: "Home", url: "/", icon: HomeIcon },
   { label: "Projects", url: "/projects", icon: FilesIcon },
   { label: "Billing", url: "/billing", icon: CreditCardIcon },
];

const MySidebarProvider = ({ children }: { children: React.ReactNode }) => {
   const { currUser } = useCurrentUser();

   const [name, setName] = useState("");
   const [description, setDescription] = useState("");

   const [isOpen, setOpen] = useState(false);
   const [isCreateModal, setCreateModal] = useState(false);

   const { createDesign, creatingDesign } = useCreateDesign();

   const handleDesign = () => {
      createDesign(
         {
            height: 1000,
            width: 1000,
            name,
            token: currUser?.data?.auth_id,
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
      <MySidebarContent.Provider value={{ isOpen, setOpen }}>
         <div className="h-screen overflow-x-hidden w-full flex">
            <div className="w-[5em] flex flex-col items-center py-4">
               <Button
                  onClick={() => {
                     setCreateModal(true);
                  }}
                  size={"sm"}
                  variant={"simple"}
                  className="flex flex-col items-center py-4"
               >
                  <PlusCircle className="shrink-0 w-20" />
                  Create
               </Button>

               <Separator className="mt-1 mb-1" />

               {routes.map((r, i) => (
                  <Link
                     className={`${buttonVariants({ variant: "simple", size: "sm" })} flex flex-col items-center w-full py-4 px-2`}
                     key={i}
                     href={r.url}
                  >
                     <r.icon />
                     {r.label}
                  </Link>
               ))}
            </div>
            <div className="w-full h-full overflow-y-auto">{children}</div>
         </div>

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
                     <Button
                        disabled={creatingDesign}
                        size={"sm"}
                        variant={"simple"}
                     >
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
      </MySidebarContent.Provider>
   );
};

export { useSidebarContext, MySidebarProvider };
