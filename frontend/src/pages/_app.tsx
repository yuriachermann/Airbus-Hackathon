import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from '~/utils/api';
import "../styles/global.css";
import { Analytics } from '@vercel/analytics/react'

import "~/styles/additional-styles/blobEffect.scss";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div
        className={`font-inter text-slate-100`}
      >
        <Component {...pageProps} />
        <Analytics />
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
