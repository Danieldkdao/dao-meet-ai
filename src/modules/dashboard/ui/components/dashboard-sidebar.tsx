"use client";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";

const firstSection = [
  {
    title: "Meetings",
    href: "/meetings",
    icon: VideoIcon,
  },
  {
    title: "Agents",
    href: "/agents",
    icon: BotIcon,
  },
];

const secondSection = [
  {
    title: "Upgrade",
    href: "/upgrade",
    icon: StarIcon,
  }
]

export const DashboardSidebar = () => {
  const pathname = usePathname();
  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 pt-2 px-2">
            <Image src="/logo.svg" alt="Meet AI logo" height={40} width={40} />
            <h1 className="text-3xl font-medium text-white">Meet.AI</h1>
          </div>
        </SidebarHeader>
        <div className="py-2 px-4">
          <Separator className="opacity-10 text-[#5D6B68]" />
        </div>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {firstSection.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                        pathname === item.href &&
                          "bg-linear-to-r/oklch border-[#5D6B68]/10"
                      )}
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <div className="flex items-center gap-2">
                          <item.icon />
                          <h2>{item.title}</h2>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <div className="py-2 px-4">
            <Separator className="opacity-10 text-[#5D6B68]" />
          </div>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {secondSection.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                        pathname === item.href &&
                          "bg-linear-to-r/oklch border-[#5D6B68]/10"
                      )}
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <div className="flex items-center gap-2">
                          <item.icon />
                          <h2>{item.title}</h2>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <DashboardUserButton />
        </SidebarFooter>
      </Sidebar>
    </>
  );
};
