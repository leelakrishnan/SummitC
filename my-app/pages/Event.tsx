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
import ViewPost from "../components/ViewPost";
import ViewEvent from "../components/ViewEvent";
import SearchEventCollectors from "../components/SearchEventCollectors";
import TeamData from "../components/TeamData";

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
    const [loading, setLoading] = useState("not-loaded");
    const [profileData, setProfileData] = useState({});
    const { user} = useMoralis();
    const [value, setValue] = useState(0);
    const [eventDetails, setEventDetails] = useState({});
    const { eventId } = router.query;
    useEffect(() => {
            setLoading("not-loaded");
            const eventDetailsLS = localStorage.getItem('event-' + eventId);
            setEventDetails(JSON.parse(eventDetailsLS));
        setLoading("loaded");
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
                                <Tab label="View Event" {...a11yProps(0)} />
                                <Tab label="Search Event Collectors" {...a11yProps(1)} />
                                <Tab label="Upload Team Data" {...a11yProps(2)} />
                            </Tabs>
                            <TabPanel value={value} index={0}>
                                <ViewEvent eventDetail={ eventDetails} />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <SearchEventCollectors eventDetail={eventDetails} />
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <TeamData/>
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
