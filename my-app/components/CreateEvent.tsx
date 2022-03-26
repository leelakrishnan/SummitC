import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";
import Select from "react-select";
import styles from "../styles/Form.module.css";
import { useRouter } from "next/router";
import Moralis from "moralis";
import {updateProfileRequest} from "../lib/update-profile";
import {uploadIpfs} from "../lib/ipfs";
import {v4 as uuidv4} from "uuid";
import axios from "axios";
import {createPostTypedData} from "../lib/create-post-typed-data";

type Props = {
  profileData: any;
};

const CreateEvent = ({ profileData }: Props) => {
  const router = useRouter();
  const [selectedSkill, setSelectedSkill] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [profileId, setProfileId] = useState("");
  const [selectedProfileType, setSelectedProfileType] = useState("");

  const [formValues, setFormValues] = useState({
    eventName: "",
    eventDescription: "",
    eventLink: "",
    skills: [],
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
    await uploadEvenDataToIpfs();
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

  const uploadEvenDataToIpfs = async () => {
    const path = await uploadEventDataToIpfs();
    const eventIPFS = "***Event" + path;
    const cid = await uploadPostToIpfs(eventIPFS);
    debugger;
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
    debugger;
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
