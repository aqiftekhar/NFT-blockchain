import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Web3Provider } from "@providers";
// import { Navbar } from "../components";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* <Navbar /> */}
      <Web3Provider>
        <Component {...pageProps} />
      </Web3Provider>
    </>
  );
}
