import { ethers } from "ethers";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { useAccount, useEnsName } from "wagmi";
import Avatar from "../src/components/Avatar";
import Blockies from "react-blockies";
import PillButton from "../src/components/PillButton";
import MainLayout from "../src/layouts/MainLayout";
import CustomLayout from "../src/layouts/CustomLayout";
import RecentView from "../src/views/RecentView";
import MobileLayout from "../src/layouts/MobileLayout";
import Worldcoin from "../src/icons/Worldcoin";
import Button from "../src/components/Button";
import { VerificationResponse, WorldIDWidget } from "@worldcoin/id";
import dynamic from "next/dynamic";

const WorldcoinVerification = dynamic(
  () => import("../src/components/WorldcoinVerification"),
  {
    ssr: false,
  }
);

const Verify: NextPage = () => {
  const router = useRouter();
  const { address, connector, isConnected } = useAccount();

  const verifyIdentity = async (verificationResponse: any) => {
    await fetch("https://developer.worldcoin.org/api/v1/verify", {
      method: "POST",
      body: JSON.stringify(verificationResponse),
    })
      .then((response) => {
        if (response.status !== 200) {
          throw Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          // This means it is a valid human!
          // Now we can post to our DB
          saveBenefactor(data.nullifier_hash);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const saveBenefactor = async (hash: string) => {
    await fetch("http://localhost:3001/benefactor", {
      method: "POST",
      body: JSON.stringify({
        address,
        hash,
      }),
    })
      .then((response) => {
        if (response.status !== 200) {
          throw Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log({ data });
        router.push("/");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <MainLayout className="bg-primary">
      <Head>
        <title>GiveFire</title>
        <meta
          name="description"
          content="GiveFire is a social donations protocol that makes the ritual of consistent collective giving go viral."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MobileLayout className="py-24 ">
        <Avatar size="4xl">
          <Blockies seed={address} size={20} scale={5} />
        </Avatar>
        <input
          type="text"
          className="text-[28px] text-offwhite border-none py-2 bg-transparent placeholder:opacity-30 placeholder:text-offwhite outline-none w-full"
          placeholder="Organization's name"
        />
      </MobileLayout>
      <CustomLayout bg="bg-offwhite grow">
        <div className="flex flex-col w-full h-full mb-12">
          <p className="text-[48px] my-6 text-primary">How it works</p>
          <p className="text-sm text-primary">
            In order to post your organization on our platform for donations,
            you have to go through a quick and easy check to verify your
            identity.
            <br />
            <br />
            We worked with our partner,{" "}
            <Worldcoin className="fill fill-primary inline-block mr-1 transform -translate-y-px" />
            to provide an anonymous & simple KYC solution that you will ever
            only need to do once!
          </p>
        </div>
        <div className="flex items-center justify-center w-full">
          <WorldcoinVerification onSuccess={verifyIdentity} />
        </div>
        {/* <Button>Verify Now</Button> */}
      </CustomLayout>
    </MainLayout>
  );
};

export default Verify;
