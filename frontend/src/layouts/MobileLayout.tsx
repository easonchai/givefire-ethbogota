import React from "react";
import Image from "next/image";
import { clsx } from "clsx";

interface IMobileLayoutProps {
  children: any;
  className?: string;
}

export const MobileLayout = ({
  children,
  className,
}: IMobileLayoutProps): JSX.Element => {
  return (
    <main
      className={clsx("py-6 px-5 flex flex-col items-start h-full", className)}
    >
      {children}
    </main>
  );
};

export default MobileLayout;
