"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchIcon } from "lucide-react";
import { DashboardCommand } from "./dashboard-command";
import { useEffect, useState } from "react";

export const DashboardNavbar = () => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "K" && (e.ctrlKey || e.metaKey)) {
        setIsCommandOpen(true);
      }
    });

    return () =>
      window.removeEventListener("keydown", (e) => {
        if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
          setIsCommandOpen(true);
        }
      });
  }, []);

  return (
    <>
      <DashboardCommand open={isCommandOpen} setOpen={setIsCommandOpen} />
      <nav className="p-4 w-full bg-white flex items-center gap-2 shadow-sm">
        <SidebarTrigger variant="outline" className="p-4.25" />
        <Button
          variant="outline"
          className="w-full max-w-60 flex items-center justify-between px-2"
          onClick={() => setIsCommandOpen(true)}
        >
          <div className="flex items-center gap-2">
            <SearchIcon className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Search</span>
          </div>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span>&#8984;</span>K
          </kbd>
        </Button>
      </nav>
    </>
  );
};
