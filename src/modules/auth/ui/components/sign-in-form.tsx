"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CircleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { FaGithub, FaGoogle } from "react-icons/fa6";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

const signInSchema = z.object({
  email: z.email({ error: "Invalid email" }),
  password: z
    .string({ error: "Invalid password" })
    .trim()
    .min(8, { error: "Password length must be longer than 8" }),
});

type SignInSchemaType = z.infer<typeof signInSchema>;

export const SignInForm = () => {
  const [isSocialSignInLoading, setIsSocialSignInLoading] = useState(false);
  const [error, setError] = useState(false);
  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting || isSocialSignInLoading;

  const handleSignIn = async (formData: SignInSchemaType) => {
    setError(false);
    await authClient.signIn.email(
      {
        ...formData,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          toast.success("Signed in successfully!");
        },
        onError: (err) => {
          setError(true);
          toast.error(err.error.message ?? "Failed to sign you in");
        },
      }
    );
  };

  const handleSocialSignIn = async (provider: "github" | "google") => {
    setIsSocialSignInLoading(true);
    const data = await authClient.signIn.social({ provider, callbackURL: "/" });
    if (data.error) {
      toast.error(
        data.error.message ?? `Failed to sign in with provider ${provider}`
      );
    }
    setIsSocialSignInLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-b-md md:rounded-l-md md:rounded-br-none border-l-2 border-y-2 shadow-sm bg-card pt-6 pb-10 px-8">
      <div>
        <h1 className="text-4xl font-bold text-center">Welcome back</h1>
        <p className="text-xl text-muted-foreground text-center">
          Login to your account
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignIn)}
          className="flex flex-col items-center gap-4 w-full"
        >
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-base font-medium">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="test@example.com"
                    className="py-5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-base font-medium">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="••••••••"
                    type="password"
                    className="py-5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && (
            <div className="bg-destructive/20 flex items-center gap-2 rounded-md px-4 py-2.5 w-full">
              <CircleAlertIcon className="text-destructive text-xs sm:text-sm md:text-base size-3 sm:size-4 md:size-5" />
              <p className="text-xs sm:text-sm md:text-base">
                Invalid email or password
              </p>
            </div>
          )}
          <Button disabled={isLoading} className="w-full text-base py-5">
            <LoadingSwap isLoading={isLoading}>Sign in</LoadingSwap>
          </Button>
        </form>
      </Form>
      <div className="flex items-center gap-2 w-full">
        <hr className="text-muted-foreground flex-1 border" />
        <p className="text-muted-foreground">Or continue with</p>
        <hr className="text-muted-foreground flex-1 border" />
      </div>
      <div className="grid grid-cols-2 gap-4 w-full">
        <Button
          variant="ghost"
          className="text-base font-medium shadow-sm border py-5"
          disabled={isLoading}
          onClick={() => handleSocialSignIn("google")}
        >
          <LoadingSwap isLoading={isLoading}>
            <div className="flex items-center gap-2">
              <FaGoogle />
              Google
            </div>
          </LoadingSwap>
        </Button>
        <Button
          variant="ghost"
          className="text-base font-medium shadow-sm border py-5"
          disabled={isLoading}
          onClick={() => handleSocialSignIn("github")}
        >
          <LoadingSwap isLoading={isLoading}>
            <div className="flex items-center gap-2">
              <FaGithub />
              Github
            </div>
          </LoadingSwap>
        </Button>
      </div>
      <p className="text-center">
        Don't have an account?{" "}
        <span>
          <Link href="/sign-up" className="underline">
            Sign up
          </Link>
        </span>
      </p>
    </div>
  );
};
