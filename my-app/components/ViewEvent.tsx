import React, { useEffect, useRef, useState } from "react";
import { useMoralis } from "react-moralis";
import Container from "@mui/material/Container";
import { useRouter } from "next/router";
import Iframe from 'react-iframe'
import styles from "../styles/Home.module.css";
import {collect} from "../lib/collect";
import {follow} from "../lib/follow";
import {BigNumber, providers, Contract, utils} from "ethers";
import Web3Modal from "web3modal";

type Props = {
    eventDetail: any;
};

const ViewEvent = ({ eventDetail }: Props) => {

    // walletConnected keep track of whether the user's wallet is connected or not
    const [walletConnected, setWalletConnected] = useState(false);

    // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
    const web3ModalRef = useRef();

    const postTitle = {
        textAlign: "center",
        fontSize: "2rem",
        fontWeight: "bold",
        marginBottom: "1rem",
        fontFamily: "Press Start 2P",
    };

    const {user} = useMoralis();
    useEffect(() => {

        // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
        if (!walletConnected) {
            // Assign the Web3Modal class to the reference object by setting it's `current` value
            // The `current` value is persisted throughout as long as this page is open
            // @ts-ignore
            web3ModalRef.current = new Web3Modal({
                providerOptions: {},
                disableInjectedProvider: false,
            });
            let e = {};
            connectWallet(e);
        }

    }, [user]);

    /*
connectWallet: Connects the MetaMask wallet
*/
    const connectWallet = async (e) => {
        try {
            if (e && e.preventDefault()) {
                e.preventDefault();
            }
        } catch (err) {
            // console.error(err);
        }
        try {
            // Get the provider from web3Modal, which in our case is MetaMask
            // When used for the first time, it prompts the user to connect their wallet
           const rs = await getProviderOrSigner();
            setWalletConnected(true);
            debugger;
        } catch (err) {
            console.error(err);
        }
    };

   async function joinTheEvent(e) {
       debugger;
       e.preventDefault();
       const signer = await getProviderOrSigner(true);
        debugger;
       const split = eventDetail.publicationId.split('-');
       const profileId = split[0];
       await follow(profileId);
       debugger;
   }

    const getProviderOrSigner = async (needSigner = false) => {
        // Connect to Metamask
        // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
        // @ts-ignore
        debugger;
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);

        // If user is not connected to the Rinkeby network, let them know and throw an error
        const {chainId} = await web3Provider.getNetwork();
        debugger;

        if (needSigner) {
            const signer = web3Provider.getSigner();
            return signer;
        }
        return web3Provider;
    };

    // @ts-ignore
    return (
        <>
            <p style={postTitle}>Events</p>
            <br />
            <div className={styles.container2} style={{ height: "500px" }}>
                <div className={styles.container3}>
                    <Iframe id="youtube-player-2" frameBorder="0" allowFullScreen="1"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            title="YouTube video player" width="940" height="560"
                            src={eventDetail.eventLink}></Iframe>
                    <button
                        className={styles.teamjoin}
                        onClick={(e) => {
                            joinTheEvent(e);
                        }}
                    >
                       Join The Event
                    </button>
                </div>
            </div>
        </>
    );
};
export default ViewEvent;
