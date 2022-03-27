import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import {profiles} from "../lib/get-profile-typed-data";
import {BigNumber} from "ethers";
import {whoCollectedEvent} from "../lib/whocollected";
const { NFTStorage, Blob } = require('nft.storage');
const client = new NFTStorage({ token: process.env.NFT_STORAGE_CLIENT_ID});

type Props = {
    eventDetail: any;
};

const TeamData = () => {

    const [formValues, setFormValues] = useState([{ question: "", answer : ""}])

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
        alert(metaDataUrl);
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
            {formValues.map((element, index) => (
                <div classquestion="form-inline" key={index}>
                    <label>question</label>
                    <input type="text" question="question" value={element.question || ""} onChange={e => handleChange(index, e)} />
                    <label>answer</label>
                    <input type="text" question="answer" value={element.answer || ""} onChange={e => handleChange(index, e)} />
                    {
                        index ?
                            <button type="button"  classquestion="button remove" onClick={() => removeFormFields(index)}>Remove</button>
                            : null
                    }
                </div>
            ))}
            <div classquestion="button-section">
                <button classquestion="button add" type="button" onClick={() => addFormFields()}>Add</button>
                <button classquestion="button submit" type="submit">Submit</button>
            </div>
        </form>
    )
};
export default TeamData;
