import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";
import Layout from "~/components/Layout";
import { PostViews } from "~/components/PostView";
import { generateSSGHelper } from "~/server/helpers/ssgHelpers";

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
