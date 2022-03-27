import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import {profiles} from "../lib/get-profile-typed-data";
import {BigNumber} from "ethers";
import {whoCollectedEvent} from "../lib/whocollected";
import styles from "../styles/Form.module.css";
const { NFTStorage, Blob } = require('nft.storage');
const client = new NFTStorage({ token: process.env.NFT_STORAGE_CLIENT_ID});

type Props = {
    eventDetail: any;
};

const TeamData = () => {

    const [formValues, setFormValues] = useState([{ question: "", answer : ""}])
    const [metaUrl, setMetaUrl] = useState("");
    let handleChange = (i, e) => {
        let newFormValues = [...formValues];
        newFormValues[i][e.target.question] = e.target.value;
        setFormValues(newFormValues);
    }

    let addFormFields = () => {
        setFormValues([...formValues, { question: "", answer: "" }])
    }

    let removeFormFields = (i) => {
        let newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        setFormValues(newFormValues)
    }


    let handleSubmit = (event) => {
        event.preventDefault();
        const metaDataUrl = store(JSON.stringify(formValues));
       setMetaUrl(metaDataUrl);
    }

    async function store(data: string) {
        const fileCid = await client.storeBlob(new Blob([data]));
        const fileUrl = "https://ipfs.io/ipfs/" + fileCid;

        const obj = {
            "name": "Project Blob",
            "information": data,
            "creator": "SummitC",
            "file_url": fileUrl
        };

        const metadata = new Blob([JSON.stringify(obj)]);
        const metadataCid = await client.storeBlob(metadata);
        const metadataUrl = "https://ipfs.io/ipfs/" + metadataCid;
        return metadataUrl;
    }

    return (
        <form  onSubmit={handleSubmit}>
            <div className={styles.formGroups}>
                <label htmlFor="name">IPFS Url</label>
                <input
                    type="text"
                    value={metaUrl}
                    name={"metaUrl"}
                   disabled={true}
                />
            </div>
            {formValues.map((element, index) => (
                <div classquestion="form-inline" key={index}>
                    <label>question</label>
                    <input type="text" question="question" placeholder={"What is your Demo Url?"} value={element.question || ""} onChange={e => handleChange(index, e)} />
                    <label>answer</label>
                    <input type="text" question="answer" placeholder={"ipfs //ipfs/qmpag1mjxceqpptqsloecauvedaemh81wxdpvpx3vc5zuz"} value={element.answer || ""} onChange={e => handleChange(index, e)} />
                    {
                        index ?
                            <button type="button"  classquestion="button remove" onClick={() => removeFormFields(index)}>Remove</button>
                            : null
                    }
                </div>
            ))}
            <div classquestion="button-section">
                <button className={styles.submit} type="button" onClick={() => addFormFields()}>Add</button>
                <br />
                <button className={styles.submit} type="submit">Submit</button>
            </div>
        </form>
    )
};
export default TeamData;
