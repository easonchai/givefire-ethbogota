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

const Verify: NextPage = () => {
  const router = useRouter();
  const { address, connector, isConnected } = useAccount();

  // const prettifyAddress = (address: string) => {
  //   if (address.length > 16) {
  //     return (
  //       address.substring(0, 8) +
  //       "..." +
  //       address.substring(address.length - 8, address.length)
  //     );
  //   }
  //   return address;
  // };

  const verifyIdentity = async (verificationResponse: any) => {
    console.log(verificationResponse);

    await fetch("https://developer.worldcoin.org/api/v1/verify", {
      method: "POST",
      body: JSON.stringify(verificationResponse),
    })
      .then((response) => response.json())
      .then((data) => {
        // if (data.)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  verifyIdentity({
    merkle_root:
      "0x1f38b57f3bdf96f05ea62fa68814871bf0ca8ce4dbe073d8497d5a6b0a53e5e0",
    nullifier_hash:
      "0x0339861e70a9bdb6b01a88c7534a3332db915d3d06511b79a5724221a6958fbe",
    action_id: "wid_staging_5ddea39dde98f1cd36ad04c0e19931b5",
    signal: "your_signal_here",
    proof:
      "0x063942fd7ea1616f17787d2e3374c1826ebcd2d41d2394d915098c73482fa59516145cee11d59158b4012a463f487725cb3331bf90a0472e17385832eeaec7a713164055fc43cc0f873d76752de0e35cc653346ec42232649d40f5b8ded28f202793c4e8d096493dc34b02ce4252785df207c2b76673924502ab56b7e844baf621025148173fc74682213753493e8c90e5c224fc43786fcd09b624115bee824618e57bd28caa301f6b21606e7dce789090de053e641bce2ce0999b64cdfdfb0a0734413914c21e4e858bf38085310d47cd4cc6570ed634faa2246728ad64c49f1f720a39530d82e1fae1532bd7ad389978b6f337fcd6fa6381869637596e63a1",
  });

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
          className="text-[28px] text-offwhite border-none py-2 bg-transparent placeholder:opacity-30 placeholder:text-offwhite outline-none"
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
        <WorldIDWidget
          actionId="wid_staging_5ddea39dde98f1cd36ad04c0e19931b5" // obtain this from developer.worldcoin.org
          signal="benefactor_verification"
          enableTelemetry
          onSuccess={verifyIdentity}
          onError={(error) => console.error(error)}
        />
        {/* <Button>Verify Now</Button> */}
      </CustomLayout>
    </MainLayout>
  );
};

export default Verify;
