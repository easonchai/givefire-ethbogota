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

const Home: NextPage = () => {
  const { address, connector, isConnected } = useAccount();

  const [avatar, setAvatar] = React.useState<string | null>();
  const [firstAvatar, setFirstAvatar] = React.useState<string | null>();
  const [name, setName] = React.useState<string | null>();
  const [firstName, setFirstName] = React.useState<string | null>();

  React.useEffect(() => {
    const provider = new ethers.providers.AlchemyProvider(
      "homestead",
      process.env.NEXT_PUBLIC_ALCHEMY_KEY
    );

    const getEnsData = async () => {
      const name = await provider.lookupAddress(
        "0x07e96f02d57a1f0eace103028d0b26fd2d5f283e"
      );
      setName(name);

      if (name) {
        const avatar = await provider.getAvatar(name);
        setAvatar(avatar);
      }

      const firstName = await provider.lookupAddress(addresses[2]);
      setFirstName(firstName);

      if (firstName) {
        const avatar = await provider.getAvatar(firstName);
        setFirstAvatar(avatar);
      }
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
              <img src={avatar} alt={name} />
            ) : (
              <Blockies seed={address} />
            )}
          </Avatar>
        </div>
        <div className="w-full h-full flex flex-col items-start justify-center my-6">
          <p className="text-sm">Your Firegiving Circle</p>
          <div className="flex flex-row justify-center space-x-2 mt-4 mb-1">
            <Avatar size="sm" className="mr-2">
              <img src={avatar} alt={name} />
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
            <img src="/icons/arrow-right.svg" alt="arrow" />
          </div>
        </div>
      </MobileLayout>
      <FeedLayout>
        <div className="flex flex-row items-center justify-end space-x-2 w-full">
          <button className="rounded-full py-2 px-[10px] text-primary">
            Recent
          </button>
          <button className="rounded-full py-2 px-[10px] text-primary bg-primary bg-opacity-20">
            Trending
          </button>
        </div>
        <Card
          title="My Body, My Rights"
          benefactor="UnicornDAO"
          imageUrl="/campaigns/mbmc_cover.png"
        >
          When people are able to access abortion care with dignity, in a safe
          and supportive environment, they thrive - leading to healthier
          families and stronger communities.
        </Card>
        <Card
          title="Support kids with cleft lips"
          benefactor="FISULAB"
          imageUrl="/campaigns/cleft_cover.png"
        >
          A Colombian non-profit foundation dedicated to patients with cleft lip
          and palate through the provision of comprehensive rehabilitation
          services with warmth and professionalism.
        </Card>
        <Card
          title="Plant more trees"
          benefactor="Arbor Day Foundation"
          imageUrl="/campaigns/trees_cover.png"
        >
          When people are able to access abortion care with dignity, in a safe
          and supportive environment, they thrive - leading to healthier
          families and stronger communities.
        </Card>
      </FeedLayout>
    </MainLayout>
  );
};

export default Home;
