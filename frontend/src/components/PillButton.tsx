import React from "react";
import Image from "next/image";
import { clsx } from "clsx";

interface IPillButtonProps {
  value: string;
  selected: boolean;
  onSelect: () => void;
  className?: string;
}

export const PillButton = ({
  value,
  selected,
  onSelect,
  className,
}: IPillButtonProps): JSX.Element => {
  return (
    <button
      className={clsx(
        "rounded-full py-2 px-[10px] text-primary transition-all duration-400 min-w-19",
        selected && "bg-primary bg-opacity-20",
        className
      )}
      onClick={onSelect}
    >
      {value}
    </button>
  );
};

export default PillButton;
