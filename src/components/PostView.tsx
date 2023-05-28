import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { type RouterOutputs } from "~/utils/api";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
type PostWithUser = RouterOutputs["posts"]["getAll"][number];
export const PostViews = ({ post, author }: PostWithUser) => {
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
          <Link href={`/@${author.id}`}>
            <h3>@{author?.username}</h3>
          </Link>
          <span> | </span>
          <span className="text-gray-400">
            {dayjs(post.createdAt).fromNow()}
          </span>
        </div>
        <Link href={`/post/${post.id}`}>
          <span className="grow text-2xl">{post.content}</span>
        </Link>
      </div>
    </div>
  );
};
