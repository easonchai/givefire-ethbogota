import React from "react";
import Image from "next/image";
import { clsx } from "clsx";

interface IAvatarProps {
  children: any;
  className?: string;
  size?: keyof typeof sizes;
}

const sizes = {
  sm: "6",
  md: "7",
  default: "10",
  "4xl": "26",
};

export const WorldcoinVerification = ({
  children,
  className,
  size = "default",
}: IAvatarProps): JSX.Element => {
  return (
    <div
      className={clsx(
        `w-${sizes[size]} h-${sizes[size]} flex items-center justify-center rounded-full overflow-hidden`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default WorldcoinVerification;
