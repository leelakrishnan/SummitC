import "../styles/globals.css";
import type { AppProps } from "next/app";
import {useState} from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MoralisProvider } from "react-moralis";
import {ApolloProvider} from "@apollo/client";
import {apolloClient} from "../lib/apollo-client";

function MyApp({ Component, pageProps }: AppProps) {
    if (!process.env.NEXT_PUBLIC_MORALIS_APP_ID || !process.env.NEXT_PUBLIC_MORALIS_SERVER_URL) {
        return (
            <>
                <h1>Moralis server not configured</h1>
                <h3>Consult a dev on the team for the environmental variables</h3>
            </>
        )
    }

    return (
        <>
            <MoralisProvider
                appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID || ""}
                serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL || ""}
                initializeOnMount={true}
            >
                <ApolloProvider client={apolloClient}>
                    <ToastContainer/>
                    {/*  WRAP THE WHOLE APP TO PROVIDE STATE*/}
                    <Component {...pageProps} />
                </ApolloProvider>
            </MoralisProvider>
        </>
    )
}

export default MyApp;
