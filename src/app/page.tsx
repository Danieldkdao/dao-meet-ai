"use client"

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

export default function Home() {
  return (
    <div>
      <Button
        onClick={async () => {
          await authClient.signOut();
          toast.success("Sign out successful!");
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
