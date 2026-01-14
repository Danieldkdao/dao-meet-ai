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
      <main className="flex flex-col h-screen w-full bg-muted">
        <DashboardNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
