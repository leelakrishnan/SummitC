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

    const {user} = useMoralis();
    useEffect(() => {

    }, [user]);



   async function joinTheEvent(e) {
       debugger;
       e.preventDefault();
        debugger;
       const split = eventDetail.publicationId.split('-');
       const profileId = split[0];
       await follow(profileId);
       debugger;
   }

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
