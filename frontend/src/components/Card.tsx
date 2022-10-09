import React from "react";
import Image from "next/image";
import { clsx } from "clsx";

interface ICardProps {
  children: any;
  className?: string;
  title: string;
  benefactor: string;
  imageUrl: string;
}

export const Card = ({
  children,
  className,
  title,
  benefactor,
  imageUrl,
}: ICardProps): JSX.Element => {
  return (
    <div className={clsx("flex flex-col w-full h-full my-5", className)}>
      <img src={imageUrl} alt="" className="mb-6" />
      <p className="text-[28px] mb-2">{title}</p>
      <p className="text-sm mb-4">by {benefactor}</p>
      <p className="text-sm">{children}</p>
      <div className="w-full border-t-2 border-offwhite my-4" />
      <div className="flex flex-row w-full items-center justify-between">
        <div className="flex flex-row flex-[3] items-center w-full">
          <img src="/avatars/pfps.png" alt="" className="mr-2" />
          <p className="text-sm">1,209 circles donated</p>
        </div>
        <p className="flex flex-[2] text-sm justify-end">USD 64,500 raised</p>
      </div>
    </div>
  );
};

export default Card;
