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

const Home: NextPage = () => {
  const { address, connector, isConnected } = useAccount();

  const [avatar, setAvatar] = React.useState<string | null>();
  const [firstAvatar, setFirstAvatar] = React.useState<string | null>();
  const [name, setName] = React.useState<string | null>();
  const [firstName, setFirstName] = React.useState<string | null>();
  const [view, setView] = React.useState<"Recent" | "Trending">("Trending");
  const router = useRouter();

  React.useEffect(() => {
    const provider = new ethers.providers.AlchemyProvider(
      "homestead",
      process.env.NEXT_PUBLIC_ALCHEMY_KEY
    );

    const getEnsData = async () => {
      provider
        .lookupAddress("0x07e96f02d57a1f0eace103028d0b26fd2d5f283e")
        .then((name) => {
          setName(name);
          if (name) {
            provider.getAvatar(name).then((avatar) => setAvatar(avatar));
          }
        });

      provider.lookupAddress(addresses[2]).then((name) => {
        setFirstName(name);
        if (name) {
          provider.getAvatar(name).then((avatar) => setFirstAvatar(avatar));
        }
      });
    };

    getEnsData();
  }, []);

  const addresses = [
    "0x53C61cfb8128ad59244E8c1D26109252ACe23d14",
    "0x53C61cfb8128ad59244E8c1D26109252ACe23d88",
    "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    "0xd8da6bf26964af9d7eed9e03e53415d388a96045",
  ];

  return (
    <MainLayout>
      <Head>
        <title>GiveFire</title>
        <meta
          name="description"
          content="GiveFire is a social donations protocol that makes the ritual of consistent collective giving go viral."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MobileLayout>
        <div className="w-full flex flex-row items-center justify-between">
          <img src="/icons/bell.svg" alt="bell" />
          <Avatar>
            {avatar ? (
              <img src={avatar} alt={name} className="w-10 h-10" />
            ) : (
              <Blockies seed={address || "0xbad"} />
            )}
          </Avatar>
        </div>
        <div className="w-full h-full flex flex-col items-start justify-center my-6">
          <p className="text-sm">Your Firegiving Circle</p>
          <div className="flex flex-row justify-center space-x-2 mt-4 mb-1">
            <Avatar size="sm" className="mr-2">
              <img src={avatar} alt={name} className="w-6 h-6" />
            </Avatar>
            +
            {/* {addresses.map((address, index) => (
              <Avatar
                className={`z-[${index + 1}] transfrom -translate-x-${
                  4 * index
                }`}
                key={index}
                size="sm"
              >
                <img src={`/avatars/address${index + 1}.png`} />
              </Avatar>
            ))} */}
            <Avatar className={`z-[0] transfrom -translate-x-0`} size="sm">
              <img src={firstAvatar} alt={firstName} />
            </Avatar>
            <Avatar className={`z-[1] transfrom -translate-x-4`} size="sm">
              <img src={`/avatars/address2.png`} />
            </Avatar>
            <Avatar className={`z-[2] transfrom -translate-x-8`} size="sm">
              <img src={`/avatars/address3.png`} />
            </Avatar>
            <Avatar className={`z-[3] transfrom -translate-x-12`} size="sm">
              <img src={`/avatars/address4.png`} />
            </Avatar>
          </div>
          <p className="text-[28px] mb-6">Her DAO gives back 🌱</p>
          <Avatar size="md" className="mb-2">
            <img
              src={firstAvatar}
              alt={firstName}
              className="w-[30px] h-[30px]"
            />
          </Avatar>
          <div className="flex flex-row items-center justify-between w-full">
            <p className="text-sm">
              {firstName} proposed{" "}
              <a href="/fund" className="underline">
                My Body, My Rights
              </a>
            </p>
            <img
              src="/icons/arrow-right.svg"
              alt="arrow"
              onClick={() => router.push("/fund")}
            />
          </div>
        </div>
      </MobileLayout>
      <FeedLayout>
        <div className="flex flex-row items-center justify-end space-x-2 w-full">
          <PillButton
            value="Recent"
            onSelect={() => setView("Recent")}
            selected={view === "Recent"}
          />
          <PillButton
            value="Trending"
            onSelect={() => setView("Trending")}
            selected={view === "Trending"}
          />
        </div>
        {view === "Recent" ? <RecentView /> : <TrendingView />}
      </FeedLayout>
    </MainLayout>
  );
};

export default Home;
