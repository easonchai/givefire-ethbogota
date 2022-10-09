import React from "react";
import Image from "next/image";
import { clsx } from "clsx";

interface IFeedLayoutProps {
  children: any;
  className?: string;
}

export const FeedLayout = ({
  children,
  className,
}: IFeedLayoutProps): JSX.Element => {
  return (
    <div className="bg-secondary">
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

export default FeedLayout;
