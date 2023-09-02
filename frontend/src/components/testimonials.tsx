import { useState, useRef, useEffect } from "react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { Transition } from "@headlessui/react";
import Particles from "./particles";

import TestimonialImg01 from "../../public/testimonial-01.jpg";
import TestimonialImg02 from "../../public/testimonial-02.jpg";
import TestimonialImg03 from "../../public/testimonial-03.jpg";

export default function Testimonials() {
  const [active, setActive] = useState<number>(0);
  const [autorotate, setAutorotate] = useState<boolean>(true);
  const [autorotateTiming] = useState<number>(5000);

  interface Item {
    img: StaticImageData;
    quote: string;
    name: string;
    role: string;
  }

  const items: Item[] = [
    {
      img: TestimonialImg01,
      quote:
        "The ability to capture responses is a game-changer. If a user gets tired of the sign up and leaves, that data is still persisted. Additionally, it's great to be able to select between formats.ture responses is a game-changer.",
      name: "Jessie J",
      role: "Ltd Head of Product",
    },
    {
      img: TestimonialImg02,
      quote:
        "I have been using this product for a few weeks now and I am blown away by the results. My skin looks visibly brighter and smoother, and I have received so many compliments on my complexion.",
      name: "Mark Luk",
      role: "Spark Founder & CEO",
    },
    {
      img: TestimonialImg03,
      quote:
        "As a busy professional, I don't have a lot of time to devote to working out. But with this fitness program, I have seen amazing results in just a few short weeks. The workouts are efficient and effective.",
      name: "Jeff Kahl",
      role: "Appy Product Lead",
    },
  ];

  const testimonials = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autorotate) return;
    const interval = setInterval(() => {
      setActive(active + 1 === items.length ? 0 : (active) => active + 1);
    }, autorotateTiming);
    return () => clearInterval(interval);
  }, [active, autorotate, autorotateTiming, items.length]);

  const heightFix = () => {
    if (testimonials.current && testimonials.current.parentElement)
      testimonials.current.parentElement.style.height = `${testimonials.current.clientHeight}px`;
  };

  useEffect(() => {
    heightFix();
  }, []);

  return (
    <section>
      <div className="mx-auto my-32 max-w-3xl px-4 sm:px-6">
        <div className="relative pb-12 md:pb-20">
          {/* Particles animation */}
          <div className="absolute left-1/2 top-0 -z-10 -mt-6 h-80 w-80 -translate-x-1/2">
            <Particles
              className="absolute inset-0 z-0"
              quantity={10}
              staticity={40}
            />
          </div>

          {/* Carousel */}
          <div className="text-center">
            {/* Testimonial image */}
            <div className="relative h-32 [mask-image:_linear-gradient(0deg,transparent,theme(colors.white)_40%,theme(colors.white))]">
              <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full before:absolute before:inset-0 before:-z-20 before:rounded-full before:bg-gradient-to-b before:from-slate-400/20 before:to-transparent before:to-20% after:absolute after:inset-0 after:-z-20 after:m-px after:rounded-full after:bg-slate-900">
                {items.map((item, index) => (
                  <Transition
                    key={index}
                    show={active === index}
                    className="absolute inset-0 -z-10 h-full"
                    enter="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700 order-first"
                    enterFrom="opacity-0 -rotate-[60deg]"
                    enterTo="opacity-100 rotate-0"
                    leave="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700"
                    leaveFrom="opacity-100 rotate-0"
                    leaveTo="opacity-0 rotate-[60deg]"
                    beforeEnter={() => heightFix()}
                  >
                    <Image
                      className="relative left-1/2 top-11 -translate-x-1/2 rounded-full"
                      src={item.img}
                      width={56}
                      height={56}
                      alt={item.name}
                    />
                  </Transition>
                ))}
              </div>
            </div>
            {/* Text */}
            <div className="mb-10 transition-all delay-300 duration-150 ease-in-out">
              <div className="relative flex flex-col" ref={testimonials}>
                {items.map((item, index) => (
                  <Transition
                    key={index}
                    show={active === index}
                    enter="transition ease-in-out duration-500 delay-200 order-first"
                    enterFrom="opacity-0 -translate-x-4"
                    enterTo="opacity-100 translate-x-0"
                    leave="transition ease-out duration-300 delay-300 absolute"
                    leaveFrom="opacity-100 translate-x-0"
                    leaveTo="opacity-0 translate-x-4"
                    beforeEnter={() => heightFix()}
                  >
                    <div className="bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 bg-clip-text text-xl font-bold text-transparent">
                      {item.quote}
                    </div>
                  </Transition>
                ))}
              </div>
            </div>
            {/* Buttons */}
            <div className="-m-1.5 flex flex-wrap justify-center">
              {items.map((item, index) => (
                <button
                  className={`btn-sm relative m-1.5 py-1.5 text-xs text-slate-300 transition duration-150 ease-in-out [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-slate-800/30 ${
                    active === index
                      ? "opacity-100"
                      : "opacity-30 hover:opacity-60"
                  }`}
                  key={index}
                  onClick={() => {
                    setActive(index);
                    setAutorotate(false);
                  }}
                >
                  <span className="relative">
                    <span className="text-slate-50">{item.name}</span>{" "}
                    <span className="text-slate-600">-</span>{" "}
                    <span>{item.role}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
