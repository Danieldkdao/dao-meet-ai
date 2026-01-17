import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

const CallLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if(!session) {
    return redirect("/sign-in");
  }
  
  return <div className="h-screen bg-black">{children}</div>;
};

export default CallLayout;
