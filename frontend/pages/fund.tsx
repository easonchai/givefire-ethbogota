import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

const Fund: NextPage = () => {
  return (
    <div className="min-h-screen min-w-screen w-full h-full bg-primary">
      <Head>
        <title>GiveFire</title>
        <meta
          name="description"
          content="GiveFire is a social donations protocol that makes the ritual of consistent collective giving go viral."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-6 px-5">
        <h1 className="text-offwhite text-[100px] leading-none">
          give <br />
          fire
        </h1>
      </main>
    </div>
  );
};

export default Fund;
