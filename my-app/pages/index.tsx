import WalletConnectProvider from '@walletconnect/web3-provider'
import { providers} from 'ethers'
import Head from 'next/head'
import {useCallback, useEffect, useReducer, useRef, useState} from 'react'
import WalletLink from 'walletlink'
import Web3Modal from 'web3modal'
import Signup from "../components/SignUp";
const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;
import styles from "../styles/Home.module.css";



export const Home = (): JSX.Element => {

    return (
        <div>
            <Head>
                <title>SummitC</title>
                <meta name="description" content="Home of Hackathon"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main>
                <div className={styles.hero}>
                    <div className={styles.header}>
                        <h1>SummitC</h1>
                        <p className={styles.about}>
                            fill me. <br />
                        </p>
                    </div>
                    <Signup/>
                </div>
            </main>
        </div>
    )
}

export default Home
