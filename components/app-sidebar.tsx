import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { SidebarOptInForm } from "@/components/sidebar-opt-in-form";
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
import { Session } from "next-auth";
import Image from "next/image";

export function AppSidebar({
  props,
  userSession,
}: {
  props?: React.ComponentProps<typeof Sidebar>;
  userSession: Session | null;
}) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center">
                  {userSession?.user?.image ? (
                    <Image
                      width={100}
                      height={100}
                      className="w-8 h-8 rounded-full"
                      src={userSession.user.image}
                      alt={userSession?.user?.name || ""}
                    />
                  ) : (
                    <GalleryVerticalEnd className="size-4" />
                  )}
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  {userSession ? userSession.user?.name : "Cardy"}
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>{/* <NavMain items={data.navMain} /> */}</SidebarContent>
      <SidebarFooter>
        <div className="p-1">
          <SidebarOptInForm />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
