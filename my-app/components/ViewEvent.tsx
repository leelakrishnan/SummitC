import React, { useEffect, useRef, useState } from "react";
import { useMoralis } from "react-moralis";
import Container from "@mui/material/Container";
import { useRouter } from "next/router";
import Iframe from 'react-iframe'
import styles from "../styles/Home.module.css";
import {collect} from "../lib/collect";
import {follow} from "../lib/follow";
import {BigNumber, providers, Contract, utils} from "ethers";

type Props = {
    eventDetail: any;
};

const ViewEvent = ({ eventDetail }: Props) => {

    const postTitle = {
        textAlign: "center",
        fontSize: "2rem",
        fontWeight: "bold",
        marginBottom: "1rem",
        fontFamily: "Press Start 2P",
    };
    const web3ModalRef = useRef();

    const {user} = useMoralis();
    useEffect(() => {
        debugger;
    }, [user]);

   async function joinTheEvent(e) {
       debugger;
       e.preventDefault();
       const signer = await getProviderOrSigner(true);

       const split = eventDetail.publicationId.split('-');
       const profileId = split[0];
       await follow(profileId);
       debugger;
   }

    const getProviderOrSigner = async (needSigner = false) => {
        // Connect to Metamask
        // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
        // @ts-ignore
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);

        // If user is not connected to the Rinkeby network, let them know and throw an error
        const {chainId} = await web3Provider.getNetwork();
        if (chainId !== 4) {
            window.alert("Change the network to Rinkeby");
            throw new Error("Change network to Rinkeby");
        }

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
