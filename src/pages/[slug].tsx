import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Spinner from "~/components/Spinner";

import { createServerSideHelpers } from "@trpc/react-query/server";
import { prisma } from "~/server/db";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";

import { api } from "~/utils/api";
import Layout from "~/components/Layout";
import Image from "next/image";

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const userId = context.params?.slug;

  if (typeof userId !== "string") throw new Error("no slug");
  const replacedUserId = userId.replace("@", "");

  await helpers.profile.getUserByUsername.prefetch({ userId: replacedUserId });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      replacedUserId,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const ProfilePage: NextPage<{ replacedUserId: string }> = ({
  replacedUserId,
}) => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    userId: replacedUserId,
  });

  if (isLoading)
    return (
      <div className="absolute flex h-screen w-screen items-center justify-center">
        <Spinner />
      </div>
    );
  if (!data)
    return (
      <div className="absolute flex h-screen w-screen items-center justify-center font-serif text-3xl">
        404
      </div>
    );
  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <Layout height="screen">
        <div className="relative h-48 bg-slate-600">
          <Image
            src={data.profilePicture}
            alt="profile-picture"
            width={125}
            height={125}
            className="absolute bottom-1 left-0 -mb-[72px] ml-4 rounded-full border-4 border-black"
          />
          <div>{data.username}</div>
        </div>
        <div className="h-[72px]"> </div>
        <div>{data.username}</div>
      </Layout>
    </>
  );
};

export default ProfilePage;
