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

export function ipfs_url_from_hash(h: string) {
    return "https://ipfs.io/ipfs/" + h;
}


const Profile = ({ profileData }: Props) => {
  const router = useRouter();
  const [selectedSkill, setSelectedSkill] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [profileId, setProfileId] = useState("");
  const [selectedProfileType, setSelectedProfileType] = useState("");

  const [formValues, setFormValues] = useState({
    profileName: "",
    name: "",
    location: "",
    website: "",
    twitterUrl: "",
    bio: "",
    company: "",
    university: "",
    linkedInProfile: "",
    experience: "",
    interests: "",
    otherInfo: "",
    city: "",
    teamMission: "",
    teamVision: "",
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
      mapProfileToFormValues(profileData);
      await mapMoralisUserInfoToFormValues(user);
      setLoading(false);
    })();
  }, [user])

  function mapProfileToFormValues(profileData: any) {
    
    const profileId = profileData?.id;
    const profileName = profileData?.handle;
    const name = profileData?.name;
    const location = profileData?.location;
    const website = profileData?.website;
    const twitterUrl = profileData?.twitterUrl;
    const bio = profileData?.bio;

    if (profileId) setProfileId(profileId);
    if (profileName) formValues.profileName = profileName;
    if (name) formValues.name = name;
    if (location) formValues.location = location;
    if (website) formValues.website = website;
    if (twitterUrl) formValues.twitterUrl = twitterUrl;
    if (bio) formValues.bio = bio;

  }

  async function mapMoralisUserInfoToFormValues(user: any) {
    
    const cid = user?.get("cid");
    if (cid) {
      let url = ipfs_url_from_hash(cid);
      let res = await axios.get(url);
      
      if (res && res.data) {
        const company = res.data.company;
        const university = res.data.university;
        const linkedInProfile = res.data.linkedInProfile;
        const experience = res.data.experience;
        const skills = res.data.skills;
        const level = res.data.level;
        const profileType = res.data.profileType;
        const teamMission = res.data.teamMission;
        const teamVision = res.data.teamVision;
        const interests = res.data.interests;
        const otherInfo = res.data.otherInfo;
        const city = res.data.city;

        if (company) formValues.company = company;
        if (university) formValues.university = university;
        if (linkedInProfile) formValues.linkedInProfile = linkedInProfile;
        if (experience) formValues.experience = experience;
        if (teamMission) formValues.teamMission = teamMission;
        if (teamVision) formValues.teamVision = teamVision;
        if (interests) formValues.interests = interests;
        if (otherInfo) formValues.otherInfo = otherInfo;
        if (city) formValues.city = city;

        if (skills) {
          let skillsObj = JSON.parse(skills);
          if (skillsObj) {
            setSelectedSkill(skillsObj);
          }
        }
        if (level) setSelectedLevel(level);
        if (profileType) {
          setSelectedProfileType(profileType);
        }
      }
    }
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("HERE");
    setLoading(true);
    const updateResponse = await updateProfileRequest({
      profileId,
      name:  formValues.name === "" ? null : formValues.name,
      bio: formValues.bio === "" ? null : formValues.bio,
      location: formValues.location === "" ? null : formValues.location,
      website: formValues.website === "" ? null : formValues.website,
      twitterUrl: formValues.twitterUrl === "" ? null : formValues.twitterUrl,
      coverPicture: null,
    });
    
    await updateAdditionalProfileData();
    toast.success(" Profile Saved!", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    setLoading(false);

  }


  function onProfileTypeChange(e: any) {
    e.preventDefault();
  }
  const updateAdditionalProfileData = async () => {
    try {
      const {path} = await uploadIpfs({
        version: 'v1',
        metadata_id: uuidv4(),
        company: formValues.company === "" ? undefined : formValues.company,
        university: formValues.university === "" ? undefined : formValues.university,
        linkedInProfile: formValues.linkedInProfile === "" ? undefined : formValues.linkedInProfile,
        experience: formValues.experience === "" ? undefined : formValues.experience,
        skills: selectedSkill.length === 0 ? undefined : JSON.stringify(selectedSkill),
        level: selectedLevel === "" ? undefined : selectedLevel,
        teamMission: formValues.teamMission === "" ? undefined : formValues.teamMission,
        teamVision: formValues.teamVision === "" ? undefined : formValues.teamVision,
        interests: formValues.interests === "" ? undefined : formValues.interests,
        otherInfo: formValues.otherInfo === "" ? undefined : formValues.otherInfo,
        city: formValues.city === "" ? undefined : formValues.city,
        external_url: null,
        name: `Additional Profile by @${profileId}`,
        appId: 'SummitCenter',
      });
      saveDataInMoralis(path);
    } finally {
      
    }
  }

  function saveDataInMoralis(path: string) {
    setUserData({
      cid: path === "" ? undefined : path,
      profileId: profileId,
    });
    const UserObj = Moralis.Object.extend("User");
    const publicUser = new UserObj();
    const postACL = new Moralis.ACL(Moralis.User.current());
    postACL.setPublicReadAccess(true);
    if (user && user.id) {
      publicUser.set("id", user.id);
    }
    publicUser.setACL(postACL);
    publicUser.save();
  }

  // @ts-ignore
  return (
    <>
      <p style={postTitle}>Profile</p>
      <div className={styles.container}>
        <form className={styles.form}>
          <div className={styles.formGroups}>
            {formErrors.profileName && (
                <p style={formErrorStyle}>{formErrors.profileName}</p>
            )}
            <label htmlFor="name">Handle</label>
            <input
                type="text"
                value={formValues.profileName}
                name={Object.keys(formValues)[0]}
                onChange={handleOnChange}
                placeholder="Profile Name"
            />
          </div>
          <div className={styles.formGroups}>
            {formErrors.name && (
                <p style={formErrorStyle}>{formErrors.name}</p>
            )}
            <label htmlFor="name">Name</label>
            <input
                type="text"
                value={formValues.name}
                name={Object.keys(formValues)[1]}
                onChange={handleOnChange}
                placeholder="Enter Name"
            />
          </div>
          <div className={styles.formGroups}>
            {formErrors.location && (
                <p style={formErrorStyle}>{formErrors.location}</p>
            )}
            <label htmlFor="name">Location</label>
            <input
                type="text"
                value={formValues.location}
                name={Object.keys(formValues)[2]}
                onChange={handleOnChange}
                placeholder="Enter Location"
            />
          </div>
          <div className={styles.formGroups}>
            {formErrors.website && (
                <p style={formErrorStyle}>{formErrors.website}</p>
            )}
            <label htmlFor="name">Website</label>
            <input
                type="text"
                value={formValues.website}
                name={Object.keys(formValues)[3]}
                onChange={handleOnChange}
                placeholder="Enter Website"
            />
          </div>
          <div className={styles.formGroups}>
            {formErrors.twitterUrl && (
                <p style={formErrorStyle}>{formErrors.twitterUrl}</p>
            )}
            <label htmlFor="name">Twitter</label>
            <input
                type="text"
                value={formValues.twitterUrl}
                name={Object.keys(formValues)[4]}
                onChange={handleOnChange}
                placeholder="@elonmusk"
            />
          </div>
          <div className={styles.formGroups}>
            {formErrors.bio && (
                <p style={formErrorStyle}>{formErrors.bio}</p>
            )}
            <label htmlFor="name">Bio</label>
            <input
                type="text"
                value={formValues.bio}
                name={Object.keys(formValues)[5]}
                onChange={handleOnChange}
                placeholder="bio"
            />
          </div>

          <div className={styles.formGroups}>
            {formErrors.company && (
                <p style={formErrorStyle}>{formErrors.company}</p>
            )}
            <label htmlFor="name">Company</label>
            <input
                type="text"
                value={formValues.company}
                name={Object.keys(formValues)[6]}
                onChange={handleOnChange}
                placeholder="company"
            />
          </div>

          <div className={styles.formGroups}>
            {formErrors.university && (
                <p style={formErrorStyle}>{formErrors.university}</p>
            )}
            <label htmlFor="name">University</label>
            <input
                type="text"
                value={formValues.university}
                name={Object.keys(formValues)[7]}
                onChange={handleOnChange}
                placeholder="university"
            />
          </div>
          <div className={styles.formGroups}>
            {formErrors.linkedInProfile && (
                <p style={formErrorStyle}>{formErrors.linkedInProfile}</p>
            )}
            <label htmlFor="name">LinkedInProfile</label>
            <input
                type="text"
                value={formValues.linkedInProfile}
                name={Object.keys(formValues)[8]}
                onChange={handleOnChange}
                placeholder="linkedInProfile"
            />
          </div>

          <div className={styles.formGroups}>
            {formErrors.experience && (
                <p style={formErrorStyle}>{formErrors.experience}</p>
            )}
            <label htmlFor="name">Experience</label>
            <input
                type="text"
                value={formValues.experience}
                name={Object.keys(formValues)[9]}
                onChange={handleOnChange}
                placeholder="experience"
            />
          </div>
          <div className={styles.formGroups}>
            {formErrors.interests && (
                <p style={formErrorStyle}>{formErrors.interests}</p>
            )}
            <label htmlFor="name">Interests</label>
            <input
                type="text"
                value={formValues.interests}
                name={Object.keys(formValues)[10]}
                onChange={handleOnChange}
                placeholder="interests"
            />
          </div>
          <div className={styles.formGroups}>
            {formErrors.otherInfo && (
                <p style={formErrorStyle}>{formErrors.otherInfo}</p>
            )}
            <label htmlFor="name">Other Info</label>
            <input
                type="text"
                value={formValues.otherInfo}
                name={Object.keys(formValues)[11]}
                onChange={handleOnChange}
                placeholder="otherInfo"
            />
          </div>
          <div className={styles.formGroups}>
            {formErrors.city && <p style={formErrorStyle}>{formErrors.city}</p>}
            <label htmlFor="name">City</label>
            <input
                type="text"
                value={formValues.city}
                name={Object.keys(formValues)[12]}
                onChange={handleOnChange}
                placeholder="city"
            />
          </div>
          <div className={styles.formGroups}>
            <label htmlFor="name">
              How would you describe your experience level
            </label>
            <select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                }}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div className={styles.formGroups}>
          <label htmlFor="name">Profile Type</label>
          <select
              value={selectedProfileType}
              onChange={(e) => {
                setSelectedProfileType(e.target.value);
                onProfileTypeChange(e);
              }}
          >
            <option value="User">User</option>
            <option value="Team">Team</option>
          </select>
          </div>
          {selectedProfileType && selectedProfileType === "Team" && (<div className={'teamDivContainer'}>
            <div className={styles.formGroups}>
              {formErrors.teamMission && <p style={formErrorStyle}>{formErrors.teamMission}</p>}
              <label htmlFor="name">Team Mission</label>
              <input
                  type="text"
                  value={formValues.teamMission}
                  name={Object.keys(formValues)[13]}
                  onChange={handleOnChange}
                  placeholder="Team Mission"
              />
            </div>
            <div className={styles.formGroups}>
              {formErrors.teamVision && <p style={formErrorStyle}>{formErrors.teamVision}</p>}
              <label htmlFor="name">Team Vision</label>
              <input
                  type="text"
                  value={formValues.teamVision}
                  name={Object.keys(formValues)[14]}
                  onChange={handleOnChange}
                  placeholder="city"
              />
            </div>
          </div>)}
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
export default Profile;
