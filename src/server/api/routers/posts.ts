import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/dist/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

interface IUser {
  id: string;
  username: string;
  profilePicture: string;
}

const filterUserForClient = (user: User) => {
  const userInfo: IUser = {
    id: user.id,
    username: user.username ?? "user",
    profilePicture: user.profileImageUrl ?? "",
  };
  return userInfo;
};

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
      })
    ).map(filterUserForClient);
    console.log(users);

    return posts.map((post) => ({
      post,
      author: users.find((user) => user.id === post.authorId),
    }));
  }),
});
