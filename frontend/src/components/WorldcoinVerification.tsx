import React from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { WorldIDWidget } from "@worldcoin/id";

interface IAvatarProps {
  onSuccess: any;
}

export const WorldcoinVerification = ({
  onSuccess,
}: IAvatarProps): JSX.Element => {
  return (
    <WorldIDWidget
      actionId="wid_staging_5ddea39dde98f1cd36ad04c0e19931b5" // obtain this from developer.worldcoin.org
      signal="benefactor_verification"
      enableTelemetry
      onSuccess={onSuccess}
      onError={(error) => console.error(error)}
    />
  );
};

export default WorldcoinVerification;
