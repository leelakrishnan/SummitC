import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useMoralis } from "react-moralis";
import Moralis from "moralis";
import Loader from "../components/Loader";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Typography } from "@mui/material";
import Nav from "../components/Nav";


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

//this makes the site more accessible
function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}
const Home = () => {
    const router = useRouter();
    const [profileId, setProfileId] = useState("");
    const [loading, setLoading] = useState("not-loaded");
    const [profile, setProfile] = useState({});
    const {authenticate, setUserData, user, isAuthenticated, logout} = useMoralis();
    const { profileQueryId } = router.query;

    useEffect(() => {
    }, [user]);

    // @ts-ignore
    return (
        <>
            <Head>
                <title>Fly TV</title>
                <meta name="description" content="Home for hackathon" />
            </Head>
            <main>
                <Nav />
                {/* <Footer /> */}
            </main>
        </>
    );
};

export default Home;
