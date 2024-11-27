import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

async function Header({}: Props) {
  const { userId } = await auth();
  return (
    <header className="flex items-center justify-between py-2 px-8 border-b mb-5">
      <div>
        <Link href="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-globe h-8 object-contain cursor-pointer"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
        </Link>
      </div>

      {userId ? (
        <div className="flex items-center justify-center">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "h-8 w-8",
              },
            }}
          />
        </div>
      ) : (
        <div>
          <SignInButton mode="modal" forceRedirectUrl="/translate" />
        </div>
      )}
    </header>
  );
}

export default Header;
