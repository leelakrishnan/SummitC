import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";
import styles from "../styles/Form.module.css";
import { useRouter } from "next/router";
import {uploadIpfs} from "../lib/ipfs";
import {v4 as uuidv4} from "uuid";
import {createPostTypedData} from "../lib/create-post-typed-data";

type Props = {
  profileData: any;
};

const CreatePost = ({ profileData }: Props) => {
  const router = useRouter();
  const [profileId, setProfileId] = useState("");
  const [formValues, setFormValues] = useState({
    post: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { user} =
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
      formValues.post = "";
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
    if (formValues.post === "") {
      errors.post = "Post is required";
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
    await createPost();
    toast.success(" Post Created Saved!", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    setLoading(false);
  }

  async function uploadPostDataToIpfs() {
    // @ts-ignore
    const {path} = await uploadIpfs({
      version: '1.0.0',
      metadata_id: uuidv4(),
      post: formValues.post === "" ? undefined : formValues.post,
      external_url: null,
      name: `Post data by @${profileId}`,
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

  const createPost = async () => {
    const path = await uploadPostDataToIpfs();
    const cid = await uploadPostToIpfs(path);
    
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
  }

  // @ts-ignore
  return (
    <>
      <p style={postTitle}>Create Post</p>
      <div className={styles.container}>
        <form className={styles.form}>
          <div className={styles.formGroups}>
            {formErrors.post && (
                <p style={formErrorStyle}>{formErrors.post}</p>
            )}
            <label htmlFor="name">Post</label>
            <input
                type="text"
                value={formValues.post}
                name={Object.keys(formValues)[0]}
                onChange={handleOnChange}
                placeholder="Post"
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
export default CreatePost;
