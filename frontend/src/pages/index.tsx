import React, {useEffect} from 'react'
import 'aos/dist/aos.css'
import AOS from 'aos'
import Image from 'next/image'
import Logo from '../components/3dLogo'
import Link from 'next/link'
import Layout from '~/components/layout/Layout'

function Home() {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: 'phone',
      duration: 500,
      easing: 'ease-out-cubic',
    })
  })

  return (
    <Layout>
      {/*  Page content */}
      <main className="grow">
        {/*  Page sections */}
        <div
          aria-hidden="true"
          className="hidden flex-col items-center lg:block select-none"
        >
          <div className="z-10 -mt-20 flex min-h-screen flex-row justify-center">
            {/*<Image*/}
            {/*  src="/Aero.png"*/}
            {/*  alt="Aero"*/}
            {/*  width={340}*/}
            {/*  height={400}*/}
            {/*  quality={100}*/}
            {/*  priority={true}*/}
            {/*  className="z-0 -mr-16 self-center"*/}
            {/*  data-aos="zoom-in"*/}
            {/*  data-aos-delay="600"*/}
            {/*/>*/}
            <span className="text-white font-black font- text-8xl z-10 h-96 w-96 self-center">
              TEAM
            </span>
            <div className="z-10 h-96 w-96 self-center">
              <Image
                src="/Logo.png"
                alt="logo"
                className="h-96 w-auto"
                width={300}
                height={300}
              />
              {/*<Logo fov={15} file='AIRBUS-8'/>*/}
            </div>
            {/*<Image*/}
            {/*  src="/Eats.png"*/}
            {/*  alt="Eats"*/}
            {/*  width={440}*/}
            {/*  height={400}*/}
            {/*  quality={100}*/}
            {/*  priority={true}*/}
            {/*  className="z-0 -ml-16 self-center"*/}
            {/*  data-aos="zoom-in"*/}
            {/*  data-aos-delay="600"*/}
            {/*/>*/}
            <span className="text-white font-black text-8xl z-10 h-96 w-96 self-center">
              INFINITY
            </span>
          </div>
          {/*Button white arrow with an orange border, to automatically scroll-down to next page*/}
          <div
            className="z-10 -mt-40 mb-40 flex items-center justify-center"
            data-aos="fade-up"
            data-aos-delay="1500"
          >
            <Link className="button-home" href="/ordering">
              <span className="label text-white">START</span>
              <span className="icon">
                <span></span>
              </span>
            </Link>
          </div>
        </div>
        <div aria-hidden="true" className="lg:hidden">
          <div className="z-10 mt-24 flex min-h-screen flex-col items-stretch justify-center">
            <Image
              src="/Aero.png"
              alt="Aero"
              width={300}
              height={300}
              quality={100}
              priority={true}
              className="z-0 mx-12 self-center"
              data-aos="zoom-in"
              data-aos-delay="500"
            />
            <div
              className="z-10 h-[400px] w-full self-center"
              data-aos="zoom-out"
              data-aos-delay="300"
            >
              <Image
                src="/Logo.png"
                alt="logo"
                className="h-96 w-auto"
                width={300}
                height={300}
              />
              {/*<Logo fov={11}/>*/}
            </div>
            <Image
              src="/Eats.png"
              alt="Eats"
              width={300}
              height={300}
              quality={100}
              priority={true}
              className="z-0 mx-12 -mt-20 self-center"
              data-aos="zoom-in"
              data-aos-delay="500"
            />
            <div className="z-10 my-20 flex items-center justify-center">
              <div
                className="button-home"
                data-aos="fade-up"
                data-aos-delay="1500"
                onClick={() => {
                  setTimeout(() => {
                    window.location.href = '/ordering'
                  }, 500) // 500 ms delay
                }}
              >
                <span className="label text-orange-700">START</span>
                <span className="icon">
                  <span></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Home
