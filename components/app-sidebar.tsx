"use client";

import * as React from "react";

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
import UserLabel from "./user_label";
import { NavMain } from "./nav-main";
import { Folders, HomeIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export function AppSidebar({
  props,
}: {
  props?: React.ComponentProps<typeof Sidebar>;
}) {
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <UserLabel />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={[
            {
              title: "Home",
              url: "/",
              icon: HomeIcon,
              isActive: pathname === "/",
            },
            {
              title: "Design",
              url: "/design",
              icon: Folders,
              isActive: pathname === "/design",
            },
          ]}
        />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-1">
          <SidebarOptInForm />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
