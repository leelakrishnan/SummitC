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
import {profiles} from "../lib/get-profile-typed-data";


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
    const [value, setValue] = useState(0);

    useEffect(() => {
        (async () => {
            const profileName = localStorage.getItem('profile_name');
            if (profileName) {
                let handles: string[] = [profileName];
                let profileRequest = {
                    handles: handles
                }
                const profileData = await profiles(profileRequest);
                debugger;
                setProfile(profileData);
                setLoading("loaded");
            }
        })();
    }, [user]);


    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
    };

    // @ts-ignore
    return (
        <>
            <Head>
                <title>Summit C</title>
                <meta name="description" content="Home for hackathon" />
            </Head>
            <main>
                <Nav />

                {loading == "not-loaded" ? (
                    <Loader loaderMessage="Processing..." />
                ) : (
                    profile &&
                    loading === "loaded" && (
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs value={value} onChange={handleChange} aria-label="My Team">
                                <Tab label="Team Info" {...a11yProps(0)} />
                                <Tab label="Github" {...a11yProps(1)} />
                            </Tabs>
                            <TabPanel value={value} index={0}>
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                            </TabPanel>
                        </Box>
                    )
                )}
                {/* <Footer /> */}
            </main>
        </>
    );
};

export default Home;
