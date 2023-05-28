import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";
import Layout from "~/components/Layout";
import Image from "next/image";
import { PostViews } from "~/components/PostView";
import { generateSSGHelper } from "~/server/helpers/ssgHelpers";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading)
    return (
      <div className="absolute left-0 right-0 flex h-screen w-screen items-center justify-center">
        <Spinner />
      </div>
    );
  if (!data || data.length === 0) return <div>User has not posted</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullpost) => (
        <PostViews
          author={fullpost.author}
          post={fullpost.post}
          key={fullpost.post.id}
        />
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = generateSSGHelper();

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
      <Layout height="full">
        <div className="relative h-36 bg-slate-600">
          <Image
            src={data.profilePicture}
            alt="profile-picture"
            width={125}
            height={125}
            className="absolute bottom-1 left-0 -mb-[72px] ml-4 rounded-full border-4 border-black"
          />
        </div>
        <div className="h-[72px]"> </div>
        <div className="p-4 text-2xl font-bold">@{data.username}</div>
        <div className="w-full border-b border-slate-400"></div>
        <ProfileFeed userId={data.id} />
      </Layout>
    </>
  );
};

export default ProfilePage;
