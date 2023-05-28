import React from "react";

type Props = {
  children: React.ReactNode;
  height?: string;
};

export default function Layout(props: Props) {
  return (
    <main className={`flex h-${props.height ?? "full"}  justify-center`}>
      <div
        className={`h-${
          props.height ?? "full"
        } w-screen border-x border-gray-500 md:max-w-2xl`}
      >
        {props.children}
      </div>
    </main>
  );
}
