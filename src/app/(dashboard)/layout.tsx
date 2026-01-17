import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth/auth";
import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const data = await auth.api.getSession({ headers: await headers() });

  if (!data?.user) {
    return redirect("/sign-in");
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="flex flex-col h-screen w-full bg-muted overflow-hidden">
        <DashboardNavbar />
        <div className="w-full h-svh p-5 flex flex-col gap-4 overflow-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
