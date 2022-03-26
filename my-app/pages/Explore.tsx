import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useMoralis } from "react-moralis";
import Loader from "../components/Loader";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Typography } from "@mui/material";
import Nav from "../components/Nav";
import {profiles} from "../lib/get-profile-typed-data";
import ViewEvent from "../components/ViewEvent";
import ViewPost from "../components/ViewPost";

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
const Explore = () => {
    const router = useRouter();
    const [profileId, setProfileId] = useState("");
    const [loading, setLoading] = useState("not-loaded");
    const [profileData, setProfileData] = useState({});
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
                const profileDataRes = await profiles(profileRequest);

                if (profileDataRes && profileDataRes.profiles && profileDataRes.profiles.items
                    && profileDataRes.profiles.items.length > 0) {
                    const profileData =  profileDataRes.profiles.items[0];
                    if (profileData) {
                        setProfileData(profileData);
                    }
                }
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
                    profileData &&
                    loading === "loaded" && (
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs value={value} onChange={handleChange} aria-label="Home">
                                <Tab label="Events" {...a11yProps(0)} />
                                <Tab label="Post" {...a11yProps(1)} />
                            </Tabs>
                            <TabPanel value={value} index={0}>
                                <ViewEvent profileData={ profileData} />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <ViewPost profileData={profileData} />
                            </TabPanel>
                        </Box>
                    )
                )}
                {/* <Footer /> */}
            </main>
        </>
    );
};

export default Explore;
