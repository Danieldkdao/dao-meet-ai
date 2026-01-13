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
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { FaGithub, FaGoogle } from "react-icons/fa6";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useState } from "react";

const signUpSchema = z
  .object({
    name: z
      .string({ error: "Invalid name" })
      .trim()
      .min(1, { error: "Name is required" }),
    email: z.email({ error: "Invalid email" }),
    password: z
      .string({ error: "Invalid password" })
      .trim()
      .min(8, { error: "Password length must be longer than 8" }),
    confirmPassword: z
      .string({ error: "Invalid password" })
      .trim()
      .min(8, { error: "Password length must be longer than 8" }),
  })
  .refine((form) => form.confirmPassword === form.password, {
    error: "Password mismatch",
    path: ["confirmPassword"],
  });

type SignUpSchemaType = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
  const [isSocialSignUpLoading, setIsSocialSignUpLoading] = useState(false);
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isLoading = form.formState.isSubmitting || isSocialSignUpLoading;

  const handleSignUp = async (formData: SignUpSchemaType) => {
    await authClient.signUp.email(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully!");
        },
        onError: (err) => {
          toast.error(err.error.message ?? "Failed to create account");
        },
      }
    );
  };

  const handleSocialSignUp = async (provider: "github" | "google") => {
    setIsSocialSignUpLoading(true);
    const data = await authClient.signIn.social({ provider, callbackURL: "/" });
    if (data.error) {
      toast.error(
        data.error.message ?? `Failed to sign up with provider ${provider}`
      );
    }
    setIsSocialSignUpLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-b-md md:rounded-l-md md:rounded-br-none border-l-2 border-y-2 shadow-sm bg-card pt-6 pb-10 px-8">
      <div>
        <h1 className="text-4xl font-bold text-center">Let's get started</h1>
        <p className="text-xl text-muted-foreground text-center">
          Create your account
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignUp)}
          className="flex flex-col items-center gap-4 w-full"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-base font-medium">Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="John Doe" className="py-5" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-base font-medium">
                  Confirm Password
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
          <Button disabled={isLoading} className="w-full text-base py-5">
            <LoadingSwap isLoading={isLoading}>Sign up</LoadingSwap>
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
          onClick={() => handleSocialSignUp("google")}
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
          onClick={() => handleSocialSignUp("github")}
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
        Already have an account?{" "}
        <span>
          <Link href="/sign-in" className="underline">
            Sign in
          </Link>
        </span>
      </p>
    </div>
  );
};
