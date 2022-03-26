

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
type Props = {
  profileData: any;
};

const ViewEvent = ({ profileData }: Props) => {

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
  // @ts-ignore
  return (
      <>
        <p style={postTitle}>Events</p>
      </>
  );
};
export default ViewEvent;
