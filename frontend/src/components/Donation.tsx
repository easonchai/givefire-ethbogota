import React from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { useRouter } from "next/router";
import Avatar from "./Avatar";

interface IDonationProps {
  donation: {
    from: string;
    amount: number;
    to: string;
    ago: number;
  };
  className?: string;
}

export const Donation = ({
  className,
  donation,
}: IDonationProps): JSX.Element => {
  const router = useRouter();
  const prettifyTime = (timeDiff: number) => {
    if (timeDiff >= 60) {
      return `${Math.floor(timeDiff / 60)}h ago`;
    } else {
      return `${timeDiff}m ago`;
    }
  };

  return (
    <div
      className={clsx(
        "flex flex-col w-full h-full my-5 cursor-pointer",
        className
      )}
    >
      <div className="flex flex-row w-full items-center justify-between mb-2">
        <div className="flex flex-row w-full items-center flex-1">
          <Avatar className="w-[18px] h-[18px]">
            <img src="/avatars/address1.png" alt="" />
          </Avatar>
          <img
            src="/avatars/pfps.png"
            alt=""
            className="transform -translate-x-1"
          />
          <Avatar className="w-[18px] h-[18px] transform -translate-x-3">
            <img src="/avatars/address5.png" alt="" />
          </Avatar>
        </div>
        <p className="text-sm flex-1 text-end">{prettifyTime(donation.ago)}</p>
      </div>
      <p className="text-sm">{donation.from}</p>
      <p className="text-sm">
        donated USD {donation.amount} to{" "}
        <a href="/fund" className="underline">
          {donation.to}
        </a>
      </p>
    </div>
  );
};

export default Donation;
