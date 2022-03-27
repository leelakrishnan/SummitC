import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";
import styles from "../styles/Form.module.css";
import { useRouter } from "next/router";
import {uploadIpfs} from "../lib/ipfs";
import {v4 as uuidv4} from "uuid";
import {createPostTypedData} from "../lib/create-post-typed-data";
import Moralis from "moralis";
import {ipfs_url_from_hash} from "./Profile";
import { signedTypeData, getAddressFromSigner, splitSignature } from '../lib/ethers-service';
import { lensHub } from '../lib/lens-hub';
import { pollUntilIndexed } from '../lib/has-transaction-been-indexed';
import { BigNumber, utils } from 'ethers';


type Props = {
  profileData: any;
};


export function ipfs_url(ipfsCid: string) {
  return "https://ipfs.io/" + ipfsCid;
}

const CreateEvent = ({ profileData }: Props) => {
  const [profileId, setProfileId] = useState("");
  const [formValues, setFormValues] = useState({
    eventName: "",
    eventDescription: "",
    eventLink: "",
    eventThumbnail: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { user, setUserData, userError, isUserUpdating, refetchUserData } =
    useMoralis();
  const postTitle = {
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    fontFamily: "Press Start 2P",
  };

  const formErrorStyle = {
    color: "red",
    fontSize: "1.2rem",
    paddingBottom: "0.5rem",
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setProfileId(profileData.id);
      formValues.eventName = "";
      formValues.eventDescription = "";
      formValues.eventLink = "";
      formValues.eventThumbnail = "";
      setLoading(false);
    })();
  }, [user])

  // create a function which set the values of form field
  const handleOnChange = (e: any) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const validateError = () => {
    const errors = {
    };
    if (formValues.eventName === "") {
      errors.eventName = "Event Name is required";
    }
    if (formValues.eventDescription === "") {
      errors.eventDescription = "Event Description is required";
    }
    if (formValues.eventLink === "") {
      errors.eventLink = "Event Link is required";
    }
    if (formValues.eventThumbnail === "") {
      errors.eventThumbnail = "Event thumbnail is required";
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
    validateError();

    setLoading(true);
    await createEvent();
    toast.success(" Event Created Saved!", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    setLoading(false);
  }

  async function uploadEventDataToIpfs() {
    // @ts-ignore
    const {path} = await uploadIpfs({
      version: '1.0.0',
      metadata_id: uuidv4(),
      eventName: formValues.eventName === "" ? undefined : formValues.eventName,
      eventDescription: formValues.eventDescription === "" ? undefined : formValues.eventDescription,
      eventLink: formValues.eventLink === "" ? undefined : formValues.eventLink,
      eventThumbnail: formValues.eventThumbnail === "" ? undefined : formValues.eventThumbnail,
      external_url: null,
      name: `Event data by @${profileId}`,
      attributes: [],
      appId: 'SummitCenter'
    }).finally();
    return path;
  }

  async function uploadPostToIpfs(eventIPFS: string) {
    const {path} = await uploadIpfs({
      version: '1.0.0',
      metadata_id: uuidv4(),
      description: eventIPFS,
      content: eventIPFS,
      external_url: null,
      name: `Event data by @${profileId}`,
      attributes: [],
      appId: 'SummitCenter'
    }).finally();
    return path;
  }

  const createEvent = async () => {
    const path = await uploadEventDataToIpfs();
    const eventIPFS = "#SummitCenter" + path;
    const cid = await uploadPostToIpfs(eventIPFS);
    
    const createPostRequest = {
      profileId,
      contentURI: 'ipfs://' + cid,
      collectModule: {
        revertCollectModule: true,
      },
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    };

    const result = await createPostTypedData(createPostRequest);
    console.log('create post: createPostTypedData', result);
    const typedData = result.data.createPostTypedData.typedData;
    console.log('create post: typedData', typedData);

    const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
    console.log('create post: signature', signature);

    const { v, r, s } = splitSignature(signature);

    const tx = await lensHub.postWithSig({
      profileId: typedData.value.profileId,
      contentURI: typedData.value.contentURI,
      collectModule: typedData.value.collectModule,
      collectModuleData: typedData.value.collectModuleData,
      referenceModule: typedData.value.referenceModule,
      referenceModuleData: typedData.value.referenceModuleData,
      sig: {
        v,
        r,
        s,
        deadline: typedData.value.deadline,
      },
    });
    console.log('create post: tx hash', tx.hash);

    console.log('create post: poll until indexed');
    const indexedResult = await pollUntilIndexed(tx.hash);

    console.log('create post: profile has been indexed', result);

    const logs = indexedResult.txReceipt.logs;
    console.log('create post: logs', logs);
    const topicId = utils.id(
        'PostCreated(uint256,uint256,string,address,bytes,address,bytes,uint256)'
    );
    console.log('topicid we care about', topicId);
    const profileCreatedLog = logs.find((l: any) => l.topics[0] === topicId);
    console.log('create post: created log', profileCreatedLog);
    let profileCreatedEventLog = profileCreatedLog.topics;
    console.log('create post: created event logs', profileCreatedEventLog);
    const publicationId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog[2])[0];
    console.log('create post: contract publication id', BigNumber.from(publicationId).toHexString());
    console.log(
        'create post: internal publication id',
        profileId + '-' + BigNumber.from(publicationId).toHexString()
    );
    await createEventInDb(profileId + '-' + BigNumber.from(publicationId).toHexString(), path);
  }

  async function createEventInDb(publicationId: string, path: string) {
    let contentUri = "";
    if (path) {
      const events = Moralis.Object.extend("Events");
      const query = new Moralis.Query(events);
      query.limit(200);
      query
          .find()
          .then(function (results: any) {
            if (results != null && results.length > 0) {
              debugger;
              let  eventDetails = results[0].get("eventDetails");
              let ipfsEventDetail = ipfs_url_from_hash(path);
              let eventDetailObj = {
                publicationId,
                ipfsEventDetail
              }
              eventDetails.push(eventDetailObj);
              const events = Moralis.Object.extend("Events");
              const eventsObj = new events();
              eventsObj.set("id", results[0].id);
              eventsObj.set("eventDetails", eventDetails);
              eventsObj.save();
            } else {
              debugger;
              let eventDetails = [];
              let ipfsEventDetail = ipfs_url_from_hash(path);
              let eventDetailObj = {
                publicationId,
                ipfsEventDetail
              }
              eventDetails.push(eventDetailObj);
              const events = Moralis.Object.extend("Events");
              const eventsObj = new events();
              eventsObj.set("eventDetails", eventDetails);
              eventsObj.save();
            }
          })
          .catch(function (error) {
          });
    }
  }
  // @ts-ignore
  return (
    <>
      <p style={postTitle}>Create Event</p>
      <div className={styles.container}>
        <form className={styles.form}>
          <div className={styles.formGroups}>
            {formErrors.eventName && (
                <p style={formErrorStyle}>{formErrors.eventName}</p>
            )}
            <label htmlFor="name">Event Name</label>
            <input
                type="text"
                value={formValues.eventName}
                name={Object.keys(formValues)[0]}
                onChange={handleOnChange}
                placeholder="Event Name"
            />
          </div>
          <div className={styles.formGroups}>
            {formErrors.eventDescription && (
                <p style={formErrorStyle}>{formErrors.eventDescription}</p>
            )}
            <label htmlFor="name">Event Description</label>
            <input
                type="text"
                value={formValues.eventDescription}
                name={Object.keys(formValues)[1]}
                onChange={handleOnChange}
                placeholder="Event Description"
            />
          </div>
          <div className={styles.formGroups}>
            {formErrors.eventLink && (
                <p style={formErrorStyle}>{formErrors.eventLink}</p>
            )}
            <label htmlFor="name">Event Link</label>
            <input
                type="text"
                value={formValues.eventLink}
                name={Object.keys(formValues)[2]}
                onChange={handleOnChange}
                placeholder="Enter event link"
            />
          </div>
          <div className={styles.formGroups}>
            {formErrors.eventThumbnail && (
                <p style={formErrorStyle}>{formErrors.eventThumbnail}</p>
            )}
            <label htmlFor="name">Event Thumbnail</label>
            <input
                type="text"
                value={formValues.eventThumbnail}
                name={Object.keys(formValues)[3]}
                onChange={handleOnChange}
                placeholder="Enter Event Thumbnail"
            />
          </div>
          {!loading ? (
              <div className={styles.formGroups}>
                <button onClick={handleSubmit} className={styles.submit}>
                  Submit
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
};
export default CreateEvent;
