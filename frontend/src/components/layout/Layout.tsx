import * as React from 'react'
import {useState} from 'react'

import Header from '~/components/layout/header/Header'
import Sidebar from '~/components/layout/Sidebar'

export default function Layout({children}: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
      <div
        className=" relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden min-h-screen bg-[#000]">
        {/*{pathname.includes("ordering") && (*/}
        {/*<div className="-z-50 fixed top-0 left-0 right-0 bottom-0 blobs" role="presentation">*/}
        {/*  <div className="blob-rotate">*/}
        {/*    <div className="blob-move">*/}
        {/*      <div className="blob"/>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div className="blob-rotate">*/}
        {/*    <div className="blob-move">*/}
        {/*      <div className="blob"/>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div className="blob-rotate">*/}
        {/*    <div className="blob-move">*/}
        {/*      <div className="blob"/>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/**/}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div id="skip-nav" className='z-0'>{children}</div>
        <span className="absolute bottom-0 mb-4 h-4 self-center text-white/10">
          © Yuri Achermann {new Date().getFullYear()}
        </span>
      </div>
    </>
  )
}
