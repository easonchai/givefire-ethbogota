import React from "react";
import Image from "next/image";
import { clsx } from "clsx";
import Card from "../components/Card";

interface ITrendingViewProps {}

export const TrendingView = ({}: ITrendingViewProps): JSX.Element => {
  return (
    <>
      <Card
        title="My Body, My Rights"
        benefactor="UnicornDAO"
        imageUrl="/campaigns/mbmc_cover.png"
      >
        When people are able to access abortion care with dignity, in a safe and
        supportive environment, they thrive - leading to healthier families and
        stronger communities.
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
        When people are able to access abortion care with dignity, in a safe and
        supportive environment, they thrive - leading to healthier families and
        stronger communities.
      </Card>
    </>
  );
};

export default TrendingView;
