import WalletConnectProvider from '@walletconnect/web3-provider'
import {ethers, providers} from 'ethers'
import Head from 'next/head'
import {useCallback, useEffect, useReducer, useRef, useState} from 'react'
import WalletLink from 'walletlink'
import Web3Modal from 'web3modal'
import Signup from "../components/SignUp";
const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;
import styles from "../styles/Home.module.css";
import {LENS_HUB_ABI} from "../lib/config";

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: INFURA_ID, // required
        },
    },
    'custom-walletlink': {
        display: {
            logo: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0',
            name: 'Coinbase',
            description: 'Connect to Coinbase Wallet (not Coinbase App)',
        },
        options: {
            appName: 'Coinbase', // Your app name
            networkUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
            chainId: 1,
        },
        package: WalletLink,
        connector: async (_, options) => {
            const { appName, networkUrl, chainId } = options
            const walletLink = new WalletLink({
                appName,
            })
            const provider = walletLink.makeWeb3Provider(networkUrl, chainId)
            await provider.enable()
            return provider
        },
    },
}

let web3Modal
if (typeof window !== 'undefined') {
    web3Modal = new Web3Modal({
        network: 'mainnet', // optional
        cacheProvider: true,
        providerOptions, // required
    })
}

type StateType = {
    provider?: any
    web3Provider?: any
    address?: string
    chainId?: number
}

type ActionType =
    | {
    type: 'SET_WEB3_PROVIDER'
    provider?: StateType['provider']
    web3Provider?: StateType['web3Provider']
    address?: StateType['address']
    chainId?: StateType['chainId']
}
    | {
    type: 'SET_ADDRESS'
    address?: StateType['address']
}
    | {
    type: 'SET_CHAIN_ID'
    chainId?: StateType['chainId']
}
    | {
    type: 'RESET_WEB3_PROVIDER'
}

const initialState: StateType = {
    provider: null,
    web3Provider: null,
    address: null,
    chainId: null,
}

function reducer(state: StateType, action: ActionType): StateType {
    switch (action.type) {
        case 'SET_WEB3_PROVIDER':
            return {
                ...state,
                provider: action.provider,
                web3Provider: action.web3Provider,
                address: action.address,
                chainId: action.chainId,
            }
        case 'SET_ADDRESS':
            return {
                ...state,
                address: action.address,
            }
        case 'SET_CHAIN_ID':
            return {
                ...state,
                chainId: action.chainId,
            }
        case 'RESET_WEB3_PROVIDER':
            return initialState
        default:
            throw new Error()
    }
}

export const Home = (): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const connectWallet = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        debugger;
        const contract = new ethers.Contract('0xd7B3481De00995046C7850bCe9a5196B7605c367', LENS_HUB_ABI, signer)
        // console.log({contract}
    }

    useEffect(() => {
        connectWallet()
    }, [])

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
