import { ColorScreen } from "@/modules/auth/ui/components/color-screen";
import { SignUpForm } from "@/modules/auth/ui/components/sign-up-form";

const SignUpPage = () => {
  return (
    <div className="w-full min-h-svh p-6 md:p-10 bg-muted flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col md:flex-row-reverse w-full max-w-sm md:max-w-3xl px-5">
        <div className="flex-1 rounded-md">
          <ColorScreen />
        </div>
        <div className="flex-1 rounded-md">
          <SignUpForm />
        </div>
      </div>
      <p className="text-center text-muted-foreground text-sm">
        By clicking continue, you agree to our{" "}
        <span className="underline cursor-pointer">Terms of Service</span> and{" "}
        <span className="underline cursor-pointer">Privacy Policy</span>
      </p>
    </div>
  );
};

export default SignUpPage;
