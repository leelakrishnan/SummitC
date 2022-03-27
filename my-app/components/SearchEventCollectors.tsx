import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import {profiles} from "../lib/get-profile-typed-data";
import {BigNumber} from "ethers";
import {whoCollectedEvent} from "../lib/whocollected";

type Props = {
    eventDetail: any;
};

const SearchEventCollectors = ({ eventDetail }: Props) => {

    const postTitle = {
        textAlign: "center",
        fontSize: "2rem",
        fontWeight: "bold",
        marginBottom: "1rem",
        fontFamily: "Press Start 2P",
    };

    const {user} = useMoralis();
    useEffect(() => {
        (async () => {

            const publicationId = eventDetail.publicationId;
            if (publicationId) {
                const request =
                    {
                        publicationId: publicationId,
                    };
                debugger;
                const result = await whoCollectedEvent(request);

                debugger;

            }
        })();
    }, [user]);

    // @ts-ignore
    return (
        <>
            <p style={postTitle}>Events</p>
            <br />
        </>
    );
};
export default SearchEventCollectors;
