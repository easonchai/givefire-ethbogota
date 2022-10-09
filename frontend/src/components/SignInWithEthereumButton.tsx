import React from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";

interface ISignInWithEthereumButtonProps {
  onSuccess: (args: { address: string }) => void;
  onError: (args: { error: Error }) => void;
}

export const SignInWithEthereumButton = ({
  onSuccess,
  onError,
}: ISignInWithEthereumButtonProps): JSX.Element => {
  const [state, setState] = React.useState<{
    loading?: boolean;
    nonce?: string;
  }>({});

  const fetchNonce = async () => {
    try {
      const nonceRes = await fetch("/api/nonce");
      const nonce = await nonceRes.text();
      setState((x) => ({ ...x, nonce }));
    } catch (error) {
      setState((x) => ({ ...x, error: error as Error }));
    }
  };

  // Pre-fetch random nonce when button is rendered
  // to ensure deep linking works for WalletConnect
  // users on iOS when signing the SIWE message
  React.useEffect(() => {
    fetchNonce();
  }, []);

  const { address } = useAccount();
  const { chain: activeChain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const signIn = async () => {
    try {
      const chainId = activeChain?.id;
      if (!address || !chainId) return;

      setState((x) => ({ ...x, loading: true }));
      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce: state.nonce,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      // Verify signature
      const verifyRes = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, signature }),
      });
      if (!verifyRes.ok) throw new Error("Error verifying message");

      setState((x) => ({ ...x, loading: false }));
      onSuccess({ address });
    } catch (error) {
      setState((x) => ({ ...x, loading: false, nonce: undefined }));
      onError({ error: error as Error });
      fetchNonce();
    }
  };

  return (
    <button
      className="w-full bg-secondary text-offwhite text-sm flex items-center justify-center py-6 rounded-[5px] mt-24"
      disabled={!state.nonce || state.loading}
      onClick={signIn}
    >
      Sign-In with Ethereum
    </button>
  );
};

export default SignInWithEthereumButton;
