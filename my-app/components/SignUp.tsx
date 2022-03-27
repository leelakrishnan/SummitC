import {BigNumber, ethers, utils} from 'ethers';
import { gql } from '@apollo/client'
import {useEffect, useState} from 'react'
import {  GET_CHALLENGE, AUTHENTICATION } from '../lens-mutation/profile'
import {apolloClient} from "../lib/apollo-client";
import {profiles, ProfilesRequest} from "../lib/get-profile-typed-data";
import Loader from "./Loader";
import { useRouter } from "next/router";
import { pollUntilIndexed } from '../lib/has-transaction-been-indexed';
import {createProfileRequest} from "../lib/create-profile";
import styles from "../styles/Form.module.css";
import {prettyJSON} from "../lib/helpers";

function SignUp() {
    const router = useRouter();
    const [profileName, setProfileName] = useState('')
    const [formValues, setFormValues] = useState({
        profileName: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        formValues.profileName = "";
    });

    const formErrorStyle = {
        color: "red",
        fontSize: "1.2rem",
        paddingBottom: "0.5rem",
    };


    const handleOnChange = (e: any) => {
        // setFormValues({...formValues, [e.target.name]: e.target.value});
        formValues.profileName = e.target.value;
        setFormValues({
            profileName: e.target.value
        })
        setProfileName(e.target.value);
        console.log(formValues.profileName);
    };

    const signText = (text) => {
        const ethersProvider = new ethers.providers.Web3Provider(window.ethereum).getSigner()
        return ethersProvider.signMessage(text);
    }

    const getAddress = async () => {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        return accounts[0];
    }

    const generateChallenge = (address) => {
        return apolloClient.query({
            query: gql(GET_CHALLENGE),
            variables: {
                request: {
                    address,
                },
            },
        })
    }

    const authenticate = (address, signature) => {
        return apolloClient.mutate({
            mutation: gql(AUTHENTICATION),
            variables: {
                request: {
                    address,
                    signature,
                },
            },
        })
    }

    const validateError = () => {
        const errors = {};
        if (profileName === "") {
            errors.profileName = "Profile Name is required";
        }
        return errors;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("HERE");
        // check form values are not empty
        const errors = validateError();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setLoading(true);
        const address = await getAddress()
        const challengeResponse = await generateChallenge(address);
        const signature = await signText(challengeResponse.data.challenge.text)
        const {data} = await authenticate(address, signature);
        localStorage.setItem('auth_token', data.authenticate.accessToken)
        let handles: string[] = [profileName];
        let profileRequest = {
            handles: handles
        }
        let profile = await profiles(profileRequest);
        if (!profile || !profile.profiles || !profile.profiles.items || profile.profiles.items.length <= 0) {
            const createProfileResult = await createProfileRequest({
                handle: profileName,
            });
            prettyJSON('create profile: result', createProfileResult.data);

            console.log('create profile: poll until indexed');
            const result = await pollUntilIndexed(createProfileResult.data.createProfile.txHash);

            console.log('create profile: profile has been indexed', result);

            const logs = result.txReceipt.logs;

            console.log('create profile: logs', logs);

            const topicId = utils.id(
                'ProfileCreated(uint256,address,address,string,string,address,bytes,string,uint256)'
            );
            console.log('topicid we care about', topicId);

            const profileCreatedLog = logs.find((l: any) => l.topics[0] === topicId);
            console.log('profile created log', profileCreatedLog);

            let profileCreatedEventLog = profileCreatedLog.topics;
            console.log('profile created event logs', profileCreatedEventLog);

            const profileId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog[1])[0];

            console.log('profile id', BigNumber.from(profileId).toHexString());
            localStorage.setItem('profile_id', BigNumber.from(profileId).toHexString());
        }
        localStorage.setItem('profile_name', profileName);
        await router.push("/Home");
        setLoading(false);
    }
    // @ts-ignore
    // @ts-ignore
    return (
        <>
            <div className={styles.container}>
                <form className={styles.form}>
                    <div className={styles.formGroups}>
                        {formErrors.profileName && (
                            <p style={formErrorStyle}>{formErrors.profileName}</p>
                        )}
                        <input
                            type="text"
                            value={formValues.profileName}
                            name={Object.keys(formValues)[0]}
                            onChange={handleOnChange}
                            placeholder="Profile Name"
                        />
                    </div>
                    {!loading ? (
                        <div className={styles.formGroups}>
                            <button onClick={handleSubmit} className={styles.submit}>
                                Join
                            </button>
                        </div>
                    ) : (
                        <div className="loader-center">
                            <div className="loader"></div>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
}
export default SignUp;
