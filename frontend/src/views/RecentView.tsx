import React from "react";
import Image from "next/image";
import { clsx } from "clsx";
import Card from "../components/Card";
import Donation from "../components/Donation";

interface IRecentViewProps {}

const donations = [
  {
    from: "Ethereum Foundation 💎",
    amount: 50,
    to: "My Body, My Rights",
    ago: 3,
  },
  {
    from: "Aztec gang gang",
    amount: 40,
    to: "My Body, My Rights",
    ago: 5,
  },
  {
    from: "Hello we are ENS 🔗",
    amount: 50,
    to: "My Body, My Rights",
    ago: 60,
  },
  {
    from: "MetaMask Marketers",
    amount: 35,
    to: "My Body, My Rights",
    ago: 70,
  },
  {
    from: "PUSH Team LFG 🛎",
    amount: 50,
    to: "My Body, My Rights",
    ago: 120,
  },
  {
    from: "Blu3 ladies 🦋",
    amount: 50,
    to: "My Body, My Rights",
    ago: 127,
  },
];

export const RecentView = ({}: IRecentViewProps): JSX.Element => {
  return (
    <>
      {donations.map((donation, index) => (
        <>
          <Donation donation={donation} key={index} />
          {index !== donations.length - 1 && (
            <div className="w-full border-t-2 border-offwhite my-4" />
          )}
        </>
      ))}
    </>
  );
};

export default RecentView;
