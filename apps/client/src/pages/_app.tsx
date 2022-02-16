import "../styles/global.css";
import { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        {getLayout(
          <>
            <Component {...pageProps} />
            <Toaster position="bottom-right" />
          </>
        )}
      </div>
    </QueryClientProvider>
  );
}
