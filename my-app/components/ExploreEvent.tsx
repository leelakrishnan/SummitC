

import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";
import Select from "react-select";
import styles from "../styles/Form.module.css";
import Moralis from "moralis";
import {updateProfileRequest} from "../lib/update-profile";
import {uploadIpfs} from "../lib/ipfs";
import {v4 as uuidv4} from "uuid";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";

type Props = {
  profileData: any;
};

const ExploreEvent = ({ profileData }: Props) => {

    const postTitle = {
        textAlign: "center",
        fontSize: "2rem",
        fontWeight: "bold",
        marginBottom: "1rem",
        fontFamily: "Press Start 2P",
    };

    const {user} = useMoralis();
    const [eventDetails, setEventDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            setLoading(true);
            await getEventDetails();
            setLoading(false);
        })();
    }, [user])

    async function getEventDetails() {
        const events = Moralis.Object.extend("Events");
        const query = new Moralis.Query(events);
        query.limit(200);
        query
            .find()
            .then(async function (eventDetailsResult: any) {
                if (eventDetailsResult && eventDetailsResult.length > 0) {
                    let eventDetailsResultData = eventDetailsResult[0].get("eventDetails");
                    let eventDetailsObj = [];
                    for (let i = 0; i < eventDetailsResultData.length; i++) {
                        if (eventDetailsResultData[i] != null && eventDetailsResultData[i].ipfsEventDetail) {
                            let res = await axios.get(eventDetailsResultData[i].ipfsEventDetail);
                            if (res && res.data) {
                                debugger;
                                res.data.publicationId = eventDetailsResultData[i].publicationId;
                                eventDetailsObj.push(res.data);
                            }
                        }
                    }
                    setEventDetails(eventDetailsObj);
                }
            });
    }

    const formErrorStyle = {
        color: "red",
        fontSize: "1.2rem",
        paddingBottom: "0.5rem",
    };

    async function handleWatchLive(eventDetail: any) {
        debugger;
        // @ts-ignore
        localStorage.setItem("event-" + eventDetail.publicationId, JSON.stringify(eventDetail));
        await router.push("/Event?eventId=" + eventDetail.publicationId);
    }

    // @ts-ignore
    return (
        <>
            <p style={postTitle}>Events</p>
            <Container
                maxWidth="xl"
                sx={{
                    pt: 4,
                    pb: 4,
                }}
            >
                <Grid
                    container
                    spacing={{xs: 2, md: 3}}
                    // columns={{ xs: 4, sm: 9, md: 12 }}
                >
                    {loading != true && eventDetails.length > 0 && eventDetails.map((eventDetail, index) => (
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3} key={index}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={eventDetail.eventThumbnail}
                                    alt="green iguana"
                                    sx={{
                                        objectFit: "contain",
                                    }}
                                    sx={{
                                        objectFit: "contain",
                                    }}
                                />
                                <CardContent>
                                    <Typography variant="subtitle1">
                                        {eventDetail.eventName}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        onClick={() => {
                                            handleWatchLive(eventDetail);
                                        }}
                                        color="primary"
                                        variant="contained"
                                        size="large"
                                    >
                                        Click here to watch live
                                    </Button>
                                </CardActions>
                            </Card>{" "}
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
};
export default ExploreEvent;
