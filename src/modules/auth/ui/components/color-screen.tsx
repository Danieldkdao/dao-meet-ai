import Image from "next/image";

export const ColorScreen = () => {
  return (
    <div className="size-full hidden rounded-r-lg bg-radial from-sidebar-accent to-sidebar md:flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 py-5">
        <Image src="/logo.svg" alt="Meet AI Logo" width={100} height={100} />
        <h1 className="text-2xl font-medium text-primary-foreground">Meet.AI</h1>
      </div>
    </div>
  );
};
