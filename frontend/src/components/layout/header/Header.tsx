import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

import Notifications from "~/components/layout/header/DropdownNotifications";
import UserMenu from "~/components/layout/header/DropdownProfile";

function Header({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (sidebarOpen: boolean) => void;
}) {
  const router = useRouter();
  const routeUser: string | undefined = Array.isArray(router.query.user)
    ? router.query.user[0] // or .join(", ") if you want to convert the array to a comma-separated string
    : router.query.user;

  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const location = useRouter();
  const { pathname } = location;

  return (
    <header className="sticky top-0 z-10 bg-gradient-to-b from-[#000] from-55% to-transparent">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex h-10 items-center justify-between">
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="text-slate-500 hover:text-slate-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="h-6 w-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>
            <Link href="/" className="flex flex-row items-center gap-2">
              <Image
                src="/Logo.png"
                alt="logo"
                className="h-6 w-auto"
                width={100}
                height={100}
              />
              <Image
                src="/Infinity.png"
                alt="name"
                className="h-4 w-auto"
                width={500}
                height={500}
              />
            </Link>
          </div>

          <div className="hidden lg:block">
            <div className="flex flex-row items-center justify-center gap-8">
              <Link href={`/ordering2?${routeUser ? `user=${routeUser}` : ""}`}>
                <span
                  className={clsx(
                    "text-[#bbbbbb] hover:text-[#fff]",
                    pathname.includes("ordering2") && "!text-[#CC5500]"
                  )}
                >
                  Training
                </span>
              </Link>
              <Link href={`/projecting?${routeUser ? `user=${routeUser}` : ""}`}>
                <span
                  className={clsx(
                    "text-[#bbbbbb] hover:text-[#fff]",
                    pathname.includes("projecting") && "!text-[#CC5500]"
                  )}
                >
                  Projecting
                </span>
              </Link>
              <Link href={`/manufacturing?${routeUser ? `user=${routeUser}` : ""}`}>
                <span
                  className={clsx(
                    "text-[#bbbbbb] hover:text-[#fff]",
                    pathname.includes("manufacturing") && "!text-[#CC5500]"
                  )}
                >
                  Manufacturing
                </span>
              </Link>
              <Link href={`/landing?${routeUser ? `user=${routeUser}` : ""}`}>
                <span
                  className={clsx(
                    "text-[#bbbbbb] hover:text-[#fff]",
                    pathname.includes("landing") && "!text-[#CC5500]"
                  )}
                >
                  Inspecting
                </span>
              </Link>
            </div>
          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:block">
              <button
                className={`flex h-6 w-6 items-center justify-center rounded-full bg-[#606060] transition duration-150 hover:bg-[#505050] ${
                  searchModalOpen ? "bg-[#606060]" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchModalOpen(true);
                }}
                aria-controls="search-modal"
              >
                <span className="sr-only">Search</span>
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="fill-current text-slate-300"
                    d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z"
                  />
                  <path
                    className="fill-current text-slate-400"
                    d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z"
                  />
                </svg>
              </button>
            </div>
            <Notifications />
            <hr className="mx-2 hidden h-6 w-px bg-slate-200 lg:block" />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
