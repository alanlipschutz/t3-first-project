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

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors?.content;
      console.log(errorMessage);
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post. Please, try again later");
      }
    },
  });
  if (!user) return null;

  return (
    <div className="flex w-full items-center justify-start gap-5">
      <UserButton afterSignOutUrl="http://localhost:3000" />
      <input
        type="text"
        placeholder="type some emoji"
        className="grow rounded-sm border-b-2 border-transparent bg-transparent p-1 outline-none transition duration-300 hover:border-blue-500"
        value={input}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <button onClick={() => mutate({ content: input })} disabled={isPosting}>
          Post
        </button>
      )}
      {isPosting && <Spinner size={20} />}
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
        <div className="flex items-center gap-3">
          <h3>@{author?.username}</h3>
          <span> | </span>
          <span className="text-gray-400">
            {dayjs(post.createdAt).fromNow()}
          </span>
        </div>
        <span className="grow text-2xl">{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();
  if (isLoading)
    return (
      <div className="absolute left-0 right-0 flex h-screen w-screen items-center justify-center">
        <Spinner />
      </div>
    );
  if (!data) return <div>Something went wrong!</div>;
  return (
    <div className="flex flex-col">
      {data?.map(({ post, author }) => (
        <PostViews key={post.id} post={post} author={author} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();

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
            <Feed />
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
