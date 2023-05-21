import { SignUp, UserButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import { type RouterOutputs, api } from "~/utils/api";

const CreatePostWizard = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex w-full items-center justify-start gap-5">
      <UserButton />
      <input
        type="text"
        placeholder="type some emoji"
        className="grow rounded-sm border-b-2 border-transparent bg-transparent p-1 outline-none transition duration-300 hover:border-blue-500"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostViews = ({ post, author }: PostWithUser) => {
  return (
    <div className="flex w-full items-center justify-start gap-5 border-b border-slate-400 p-8">
      <Image
        src={author?.profilePicture ?? ""}
        alt="profile picture"
        width={48}
        height={48}
        className="rounded-full"
      />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-gray-400">
          <h3>@{author?.username}</h3>
          <span> | </span>
          <span> 1 hour ago </span>
        </div>
        <span className="grow">{post.content}</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Something went wrong!</div>;
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        {user.isSignedIn && (
          <div className="w-full border-x border-slate-400 md:max-w-2xl">
            <header className="flex justify-between border-b border-slate-400 p-4">
              <CreatePostWizard />
            </header>
            <div className="flex flex-col">
              {data?.map(({ post, author }) => (
                <PostViews key={post.id} post={post} author={author} />
              ))}
            </div>
          </div>
        )}
        {!user.isSignedIn && (
          <div className="flex h-full items-center justify-center">
            <SignUp />
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
