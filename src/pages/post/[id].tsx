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
  const id = context.params?.id;
  if (typeof id !== "string") throw new Error("no id");
  await helpers.posts.getPostById.prefetch({ id: id });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
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

const PostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data, isLoading } = api.posts.getPostById.useQuery({
    id: id,
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
        <title>{`${data.post.id}`}</title>
      </Head>
      <Layout height="full">
        <PostViews author={data.author} post={data.post} />
      </Layout>
    </>
  );
};

export default PostPage;
