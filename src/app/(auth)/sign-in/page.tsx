import { ColorScreen } from "@/modules/auth/ui/components/color-screen";
import { SignInForm } from "@/modules/auth/ui/components/sign-in-form";

const SignInPage = () => {
  return (
    <div className="w-full mt-10 flex flex-col gap-4 items-center justify-center">
      <div className="grid grid-cols-2 w-full max-w-210">
        <SignInForm />
        <ColorScreen />
      </div>
      <p className="text-center text-muted-foreground text-sm">
        By clicking continue, you agree to our{" "}
        <span className="underline cursor-pointer">Terms of Service</span> and{" "}
        <span className="underline cursor-pointer">Privacy Policy</span>
      </p>
    </div>
  );
};

export default SignInPage;
