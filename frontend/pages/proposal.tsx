import { ethers } from "ethers";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import { useEnsAvatar, useAccount, useEnsName } from "wagmi";
import MainLayout from "../src/layouts/MainLayout";
import MobileLayout from "../src/layouts/MobileLayout";
import Blockies from "react-blockies";
import Avatar from "../src/components/Avatar";
import Link from "next/link";
import FeedLayout from "../src/layouts/FeedLayout";
import Card from "../src/components/Card";
import clsx from "clsx";
import TrendingView from "../src/views/TrendingView";
import RecentView from "../src/views/RecentView";
import PillButton from "../src/components/PillButton";
import { useRouter } from "next/router";
import ReactSlider from "react-slider";

const Proposal: NextPage = () => {
  const router = useRouter();
  const [donationAmount, setDonationAmount] = React.useState<number>(5);

  return (
    <MainLayout className="bg-secondary relative">
      <Head>
        <title>GiveFire</title>
        <meta
          name="description"
          content="GiveFire is a social donations protocol that makes the ritual of consistent collective giving go viral."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <img
        src="/icons/close.svg"
        alt=""
        className="absolute top-4 right-4 cursor-pointer"
        onClick={() => router.push("/fund")}
      />
      <FeedLayout className="my-12">
        <img
          src="/campaigns/mbmc_cover.png"
          alt=""
          className="w-36 h-36 mb-6"
        />
        <p className="text-[28px] mb-1">My Body, My Rights</p>
        <p className="text-sm mb-9">by UnicornDAO</p>

        <p className="text-sm mb-4">Her DAO gives back 🌱 </p>
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-row items-center">
            <Avatar size="md" className="mr-2">
              <Blockies seed={"a"} />
            </Avatar>
            <p className="text-sm">vitalik.eth proposed this fund</p>
          </div>
          <div className="flex items-center justify-end">
            <p className="text-sm">USDC 10</p>
          </div>
        </div>
        <div className="w-full border-t-2 border-offwhite my-4" />
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-row items-center">
            <Avatar size="md" className="mr-2">
              <Blockies seed={"b"} />
            </Avatar>
            <p className="text-sm">Lou</p>
          </div>
          <div className="flex items-center justify-end">
            <p className="text-sm">USDC 8</p>
          </div>
        </div>
        <div className="w-full border-t-2 border-offwhite my-4" />
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-row items-center">
            <Avatar size="md" className="mr-2">
              <Blockies seed={"c"} />
            </Avatar>
            <p className="text-sm">Gem</p>
          </div>
          <div className="flex items-center justify-end">
            <p className="text-sm">USDC 10</p>
          </div>
        </div>
        <div className="w-full border-t-2 border-offwhite my-4" />
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-row items-center">
            <Avatar size="md" className="mr-2">
              <Blockies seed={"d"} />
            </Avatar>
            <p className="text-sm">Jenni</p>
          </div>
          <div className="flex items-center justify-end">
            <p className="text-sm">USDC 10</p>
          </div>
        </div>
        <div className="w-full border-t-2 border-offwhite my-4" />
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-row items-center">
            <Avatar size="md" className="mr-2">
              <Blockies seed={"e"} />
            </Avatar>
            <p className="text-sm">Emma</p>
          </div>
          <div className="flex items-center justify-end">
            <p className="text-sm text-primary">USDC {donationAmount}</p>
          </div>
        </div>
        <p className="text-sm mt-6 mb-2">Adjust amount (USDC)</p>
        <ReactSlider
          className="w-full mt-4 mb-8"
          defaultValue={donationAmount}
          value={donationAmount}
          min={1}
          max={10}
          renderThumb={(props) => (
            <div
              {...props}
              className="w-6 h-6 bg-primary rounded-full transform -translate-y-[40%] outline-none"
            />
          )}
          renderTrack={(props) => (
            <div
              {...props}
              className="h-[3px] bg-primary bg-opacity-20 rounded-full"
            />
          )}
          onChange={(value) => setDonationAmount(value)}
        />
        <div className="flex flex-row items-center justify-between w-full">
          <p
            className="text-sm text-primary"
            onClick={() => router.push("/fund")}
          >
            Reject
          </p>
          <PillButton
            value="Donate"
            selected={true}
            onSelect={() => console.log("magic")}
          />
        </div>
      </FeedLayout>
    </MainLayout>
  );
};

export default Proposal;
