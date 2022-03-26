import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";
import Select from "react-select";
import styles from "../styles/Form.module.css";
import { useRouter } from "next/router";
import Moralis from "moralis";

const options = [
  { label: "HTML/CSS", value: "HTML/CSS" },
  { label: "Java", value: "Java" },
  { label: "JavaScript", value: "JavaScript" },
  { label: "TypeScript", value: "TypeScript" },
  { label: "SQL", value: "SQL" },
  { label: "Swift", value: "Swift" },
  { label: "Node.Js", value: "Node.Js" },
  { label: "Python", value: "Python" },
  { label: "PHP", value: "PHP" },
  { label: "NextJS", value: "NextJS" },
  { label: "React", value: "React" },
  { label: "Moralis", value: "Moralis" },
  { label: "Web3Knowledge", value: "Web3Knowledge" },
  { label: "Solidity", value: "Solidity" },
];


type Props = {
  profileData: any;
};

const Profile = ({ profileData }: Props) => {
  const router = useRouter();
  const [selectedSkill, setSelectedSkill] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [formValues, setFormValues] = useState({
    profileName: "",
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    university: "",
    githubUserName: "",
    linkedInProfile: "",
    experience: "",
    interests: "",
    otherInfo: "",
    city: "",
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

  const { profileId } = router.query;

  useEffect(() => {
      mapProfileToFormValues(profileData);
  }, [user]);

  function mapProfileToFormValues(profileData: any) {
    const profileName = profileData?.handle;

    if (profileName) formValues.profileName = profileName;
  }

  // create a function which set the values of form field
  const handleOnChange = (e: any) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const validateError = () => {
    const errors = {
    };
    return errors;
  };

  const handleCancel = async (e: any) => {
    e.preventDefault();
    router.push("/Team");
  };

  function getBadges() {
    let initialUserEmall = user?.get("email");
    if (initialUserEmall) {
    } else {
      return 1;
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("HERE");
  };

  // @ts-ignore
  return (
    <>
      <p style={postTitle}>Profile</p>
      <div className={styles.container}>
        <form className={styles.form}>
          <div className={styles.formGroups}>
            <label htmlFor="name">Profile Name</label>
            <input
              type="text"
              value={formValues.profileName}
              name={Object.keys(formValues)[0]}
              disabled={true}
            />
          </div>
          {!loading ? (
            <div className={styles.formGroups}>
              <button onClick={handleSubmit} className={styles.submit}>
                Submit
              </button>
              <button onClick={handleCancel} className={styles.submit}>
                Cancel
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
export default Profile;
