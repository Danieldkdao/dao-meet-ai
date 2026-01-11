import Image from "next/image";

export const ColorScreen = () => {
  return (
    <div className="size-full rounded-r-md bg-radial from-green-700 to-green-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Image src="/logo.svg" alt="Meet AI Logo" width={100} height={100} />
        <h1 className="text-2xl font-medium text-primary-foreground">Meet.AI</h1>
      </div>
    </div>
  );
};
