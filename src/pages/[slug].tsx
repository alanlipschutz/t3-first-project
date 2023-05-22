import { SignUp, UserButton, useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Spinner from "~/components/Spinner";

import { type RouterOutputs, api } from "~/utils/api";

const ProfilePage: NextPage = () => {
  const user = useUser();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div>Profile view</div>
      </main>
    </>
  );
};

export default ProfilePage;
