import { ethers } from "ethers";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import Avatar from "../src/components/Avatar";
import PillButton from "../src/components/PillButton";
import CustomLayout from "../src/layouts/CustomLayout";
import MainLayout from "../src/layouts/MainLayout";
import MobileLayout from "../src/layouts/MobileLayout";
import RecentView from "../src/views/RecentView";

const Fund: NextPage = () => {
  const router = useRouter();
  const [firstAvatar, setFirstAvatar] = React.useState<string | null>();
  const [firstName, setFirstName] = React.useState<string | null>();

  React.useEffect(() => {
    const provider = new ethers.providers.AlchemyProvider(
      "homestead",
      process.env.NEXT_PUBLIC_ALCHEMY_KEY
    );

    const getEnsData = async () => {
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

      <img
        src="/campaigns/mbmc_cover.png"
        alt=""
        className="w-screen h-full aspect-square relative"
      />
      <img
        src="/icons/back.svg"
        alt=""
        className="absolute top-6 left-6 cursor-pointer"
        onClick={() => router.push("/")}
      />
      <MobileLayout>
        <h1 className="text-[48px] leading-none my-6">My Body, My Rights</h1>
        <p className="text-sm mb-6">
          When people are able to access abortion care with dignity, in a safe
          and supportive environment, they thrive - leading to healthier
          families and stronger communities.{" "}
        </p>
        <div className="w-full border-t-2 border-offwhite my-4" />
        <div className="flex flex-row w-full items-center justify-between">
          <p className="text-sm">Firegifting circles</p>
          <div className="flex flex-row flex-1 items-center justify-end">
            <img src="/avatars/pfps.png" alt="" />
            <p className="ml-1 text-sm">1,209 donated</p>
          </div>
        </div>
        <div className="w-full border-t-2 border-offwhite my-4" />
        <div className="flex flex-row w-full items-center justify-between">
          <p className="text-sm">Total donations</p>
          <p className="text-sm">USDC $64,500 raised</p>
        </div>
        <div className="w-full border-t-2 border-offwhite my-4" />
        <div className="flex flex-row w-full items-center justify-between">
          <p className="text-sm">Fund start date</p>
          <p className="text-sm">5 Oct 2022</p>
        </div>
        <div className="w-full border-t-2 border-offwhite my-4" />
      </MobileLayout>
      <CustomLayout bg="bg-offwhite">
        <p className="text-[48px] text-primary">Donations</p>
        <RecentView textColor="primary" />
      </CustomLayout>
      <CustomLayout bg="bg-profiles pb-32">
        <div className="flex flex-row items-center justify-between w-full">
          <p className="text-[48px]">UnicornDAO</p>
          <img src="/icons/arrow-right.svg" alt="arrow" />
        </div>
        <p className="text-sm my-4">
          LegalAbortion.eth is a crypto wallet that functions as a donation
          center for traditional reproductive rights institutions (like Planned
          Parenthood) who don&apos;t otherwise have the logistical means to
          accept such donations.
          <br />
          <br />A product of UnicornDAO — an initiative co-founded by Pussy
          Riot&apos;s Nadya Tolokonnikov that aims to redistribute wealth to
          women and LGBTQ+ individuals — and Endaoment, a Web3-focused
          philanthropic organization, LegalAbortion.eth is the culmination of
          lessons learned from UnicornDAO&apos;s previous humanitarian
          fundraising efforts.
        </p>
        <div className="flex flex-row space-x-4 items-end mt-4">
          <img src="/campaigns/unicorndao.png" alt="" />
          <img src="/icons/twitter.svg" alt="" />
        </div>
        <div className="flex flex-row mt-4 mb-6 items-center">
          <p className="text-sm mr-2">Verified by</p>
          <img src="/icons/worldcoin.svg" alt="" />
        </div>
        <div className={`w-full border-t-2 border-offwhite my-4`} />
        <p className="text-sm mb-2">9 Oct 2022</p>
        <p className="text-sm">
          Id praesent mauris, ut quisque suscipit morbi tellus quis. Lorem
          vulputate netus cursus morbi aliquam amet. Placerat sociis quam
          ultricies ac maecenas lectus. Magna volutpat viverra mi, sed. A diam
          volutpat ornare id ac eget ante ac ultricies.
        </p>
        <div className={`w-full border-t-2 border-offwhite my-4`} />
        <p className="text-sm mb-2">9 Oct 2022</p>
        <p className="text-sm">
          Id praesent mauris, ut quisque suscipit morbi tellus quis. Lorem
          vulputate netus cursus morbi aliquam amet. Placerat sociis quam
          ultricies ac maecenas lectus. Magna volutpat viverra mi, sed. A diam
          volutpat ornare id ac eget ante ac ultricies.
        </p>
      </CustomLayout>
      <div className="flex flex-col w-full p-5 fixed bottom-0 left-0 space-y-4 bg-clip-content">
        <div className="flex flex-col w-full p-5 space-y-4 rounded-[5px] bg-secondary">
          <div className="flex flex-row items-center">
            <Avatar size="md" className="mr-2">
              <img
                src={firstAvatar}
                alt={firstName}
                className="w-[30px] h-[30px]"
              />
            </Avatar>
            <p className="text-sm">vitalik.eth proposed this fund</p>
          </div>
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-row items-center">
              <Avatar
                className={`z-[0] transfrom -translate-x-0 border border-offwhite`}
                size="sm"
              >
                <img src={firstAvatar} alt={firstName} />
              </Avatar>
              <Avatar
                className={`z-[1] transfrom -translate-x-2 border border-offwhite`}
                size="sm"
              >
                <img src={`/avatars/address2.png`} />
              </Avatar>
              <Avatar
                className={`z-[2] transfrom -translate-x-4 border border-offwhite`}
                size="sm"
              >
                <img src={`/avatars/address3.png`} />
              </Avatar>
              <Avatar
                className={`z-[3] transfrom -translate-x-6 border border-offwhite`}
                size="sm"
              >
                <img src={`/avatars/address4.png`} />
              </Avatar>
              <p className="text-sm transform -translate-x-4">4 agreed</p>
            </div>
            <PillButton
              value="View"
              onSelect={() => router.push("/proposal")}
              selected={true}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Fund;
