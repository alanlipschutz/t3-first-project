import type { User } from "@clerk/nextjs/dist/server";

export const filterUserForClient = (user: User) => {
  const userInfo = {
    id: user.id,
    username: user.username || user.firstName,
    profilePicture: user.profileImageUrl,
  };
  return userInfo;
};
