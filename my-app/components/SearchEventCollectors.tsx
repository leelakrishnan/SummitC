

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

const SearchEventCollectors = ({ profileData }: Props) => {

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
    }
    // @ts-ignore
    return (
        <>
            <p style={postTitle}>Event Collectors</p>
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
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={"https://avatars.githubusercontent.com/u/2261933?s=400&u=396230fc411c89eaf2ab601cece115f58c2ef6aa&v=4"}
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
                                        Github: https://github.com/leelakrishnan
                                    </Typography>
                                </CardContent>
                            </Card>{" "}
                        </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="300"
                                image={"https://avatars.githubusercontent.com/u/62179036?v=4"}
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
                                    Github: https://github.com/tippi-fifestarr
                                </Typography>
                            </CardContent>
                        </Card>{" "}
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};
export default SearchEventCollectors;
