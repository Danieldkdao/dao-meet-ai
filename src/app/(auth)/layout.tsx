import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const data = await auth.api.getSession({ headers: await headers() });
  if (data?.user) {
    return redirect("/");
  }
  
  return children;
};

export default AuthLayout;
