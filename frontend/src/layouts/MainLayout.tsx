import React from "react";
import Image from "next/image";
import { clsx } from "clsx";

interface IMainLayoutProps {
  children: any;
  className?: string;
}

export const MainLayout = ({
  children,
  className,
}: IMainLayoutProps): JSX.Element => {
  return (
    <div
      className={clsx(
        "min-h-screen min-w-screen w-full h-full bg-primary flex flex-col",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MainLayout;
