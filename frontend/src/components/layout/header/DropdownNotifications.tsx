import React, { useEffect, useRef, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {api} from '~/utils/api'
import { format } from 'date-fns';
import Link from 'next/link'

function DropdownNotifications() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef<HTMLButtonElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(event.target as Node) ||
        trigger.current?.contains(event.target as Node)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const queryOrders = api.order.read.useQuery().data?.slice(-7)

  return (
    <div className="relative inline-flex">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <div className="hidden lg:block">
            <button
              ref={trigger}
              className={`flex h-6 w-6 items-center justify-center rounded-full bg-[#606060] transition duration-150 hover:bg-[#505050] ${
                dropdownOpen ? "bg-slate-800" : ""
              }`}
              aria-haspopup="true"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
            >
              <span className="sr-only">Notifications</span>
              <svg
                className="h-3 w-3"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="fill-current text-slate-300"
                  d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z"
                />
              </svg>
              {/*TODO: vanish notification ping when read*/}
              <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#6399ae]"></div>
            </button>
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="z-30 mt-1 min-w-[220px] max-w-sm rounded-b-lg bg-[#3f3f3f] p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
            sideOffset={5}
          >
            <div
              ref={dropdown}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setDropdownOpen(false)}
            >
              <div className="px-4 pb-2 pt-1.5 text-xs font-semibold uppercase text-slate-200">
                Orders placed
              </div>
              {/*TODO: place all the orders here*/}
              <ul>
                {queryOrders?.map((order)=>(
                  <li key={order.order_id} className="border-b border-slate-200 last:border-0">
                    <Link className="block px-4 py-2 hover:bg-slate-500" href="/orders">
                      <div>
                      <span className="mb-2 block text-sm text-slate-200">
                        📣{" "}
                        <span className="font-medium text-slate-200">
                          {order.order_user} ordered a {order.order_food} in {order.order_city}
                        </span>{" "}
                      </span>
                        <span className="block text-xs font-medium text-slate-200">
                        {format(order.order_created_at, 'd MMM - (HH:mm)')}
                      </span>
                      </div>
                    </Link>
                  </li>
                ))}
                <li className="border-b border-slate-200 last:border-0">
                  <Link className="block px-4 py-2 hover:bg-slate-500" href="/orders">
                    <div>
                      <span className="mb-2 block text-sm text-slate-200">
                        <span className="font-medium text-slate-200">
                          See more...
                        </span>{" "}
                      </span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

export default DropdownNotifications;
