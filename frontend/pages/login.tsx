import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Button from "../src/components/Button";
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import Lottie from "lottie-react";
import logoAnimation from "../public/logo.json";
import { useState, useEffect } from "react";

import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import React from "react";
import SignInWithEthereumButton from "../src/components/SignInWithEthereumButton";
import { useRouter } from "next/router";
import MainLayout from "../src/layouts/MainLayout";
import MobileLayout from "../src/layouts/MobileLayout";

const Login: NextPage = () => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const router = useRouter();

  const { address, isConnected } = useAccount();

  const [state, setState] = React.useState<{
    address?: string;
    error?: Error;
    loading?: boolean;
  }>({});

  React.useEffect(() => {
    if (address && state && state.address) {
      router.push("/");
    }
  }, [address, state, router]);

  // Fetch user when:
  React.useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch("/api/me");
        const json = await res.json();
        setState((x) => ({ ...x, address: json.address }));
      } catch (_error) {}
    };
    // 1. page loads
    handler();

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);

  return (
    <MainLayout className="justify-end bg-secondary relative">
      <Head>
        <title>GiveFire</title>
        <meta
          name="description"
          content="GiveFire is a social donations protocol that makes the ritual of consistent collective giving go viral."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MobileLayout className="justify-end">
        <Lottie
          animationData={logoAnimation}
          loop={true}
          className="absolute top-[50%] transform -translate-y-[80%]"
        />
        <h1 className="text-offwhite text-[28px] leading-none mb-2">
          GIVE FIRE
        </h1>
        <p className="text-sm">
          A collective giving protocol that makes the ritual of consistent
          collective giving go viral
        </p>

        {isConnected ? (
          <SignInWithEthereumButton
            onSuccess={({ address }) => setState((x) => ({ ...x, address }))}
            onError={({ error }) => setState((x) => ({ ...x, error }))}
          />
        ) : (
          <div className="mt-6 space-y-4 w-full">
            {connectors.map((connector) => (
              <Button key={connector.id} onClick={() => connect({ connector })}>
                {connector.name === "web3Auth"
                  ? "Create a new wallet"
                  : "Connect to existing wallet"}
              </Button>
            ))}
            {/* {error && <div>{error.message}</div>} */}
          </div>
        )}
      </MobileLayout>
    </MainLayout>
  );
};

export default Login;
