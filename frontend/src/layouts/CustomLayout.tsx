import React from "react";
import Image from "next/image";
import { clsx } from "clsx";

interface ICustomLayoutProps {
  children: any;
  className?: string;
  bg: string;
}

export const CustomLayout = ({
  children,
  className,
  bg,
}: ICustomLayoutProps): JSX.Element => {
  return (
    <div className={bg}>
      <main
        className={clsx(
          "py-8 px-5 flex flex-col items-start h-full",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default CustomLayout;
