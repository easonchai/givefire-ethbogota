import React from "react";
import Image from "next/image";
import { clsx } from "clsx";

interface IButtonProps {
  children: any;
  className?: string;
  onClick?: any;
}

export const Button = ({
  children,
  onClick,
  className,
}: IButtonProps): JSX.Element => {
  return (
    <div
      className={clsx(
        "w-full bg-primary text-offwhite text-sm flex items-center justify-center py-6 rounded-[5px]",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Button;
