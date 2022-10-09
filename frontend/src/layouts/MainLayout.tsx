import React from "react";
import Image from "next/image";
import { clsx } from "clsx";

interface IMainLayoutProps {
  children: any;
  className?: string;
  bg?: string;
}

export const MainLayout = ({
  children,
  className,
  bg = "bg-primary",
}: IMainLayoutProps): JSX.Element => {
  return (
    <div
      className={clsx(
        "min-h-screen min-w-screen w-full h-full flex flex-col",
        className,
        bg
      )}
    >
      {children}
    </div>
  );
};

export default MainLayout;
