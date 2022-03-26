import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { toast } from "react-toastify";
import { useMoralis } from "react-moralis";
import { AvatarPickerDialog, Avatar as AtlaskAvatar } from '@atlaskit/media-avatar-picker';
import { ModalTransition } from '@atlaskit/modal-dialog';
import { Avatar } from "@mui/material";
import Moralis from "moralis";
import {Contract, providers} from "ethers";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";

const avatars: Array<AtlaskAvatar> = [
    {dataURI:'https://ipfs.io/ipfs/bafybeih4oxzw7zfgpokhfk3amxhkkkxkn54xow4uwskdb2nhgnfqqmvbbq'},
    {dataURI:'https://ipfs.io/ipfs/bafybeihxazgvkvu5ql6xy67usboq5t2eb4mntqqmjxbcl3vppaenxtcgb4'},
    {dataURI:'https://ipfs.io/ipfs/bafybeidl2fxdcublvkhtnjyorvdwktz4byyb57md22gcte6cgtgd7ijeme'},
    {dataURI:'https://ipfs.io/ipfs/bafybeibsnh2zxfgwzcjezld2meuv6e3fzhowike2wkodr2u4dverwyoanm'},
    {dataURI:'https://ipfs.io/ipfs/bafybeibdt2iiml5kmzllqiyruy5zzcjjmxqqczzmx7mudyyz5pnfmtzp2u'},
    {dataURI:'https://ipfs.io/ipfs/bafybeidm3jer3h2bflgykurcbtuxoplgswvgmvkbtri3cw5lem3j352hcu'},
    {dataURI:'https://ipfs.io/ipfs/bafybeiaz6vu66ko4qeeapors2ldv7qs7qynl2upaqy6lvnp5wiuqonapku'},
    {dataURI:'https://ipfs.io/ipfs/bafybeibbbuatg37nerjc74xke7lxn2ofzhl4yo7cpinyik7iajt46s7bua'},
    {dataURI:'https://ipfs.io/ipfs/bafybeibhekxlwe3eksmu6ooezlk7qjey256su4lziocjbytgdzm5j2mgrq'},
    {dataURI:'https://ipfs.io/ipfs/bafybeia7sq2hddrgeczaqhkxabkjbr2e5gfyt6ntn5trbxrwhzhu55dfkq'},
    {dataURI:'https://ipfs.io/ipfs/bafybeigyr2oacxcb7ffvoisrfb2tid4u7zzhym3ulkh6laixj4hmf4pzau'},
    {dataURI:'https://ipfs.io/ipfs/bafybeidf3q2xinbfv5ecoxffosliag3n44zax7dbfz4sye5uldtynq7uue'},
    {dataURI:'https://ipfs.io/ipfs/bafybeifqkcwtaxasrxapjlq6ovbrietwp26yfumhxgcoq2wkwjudflxsye'},
    {dataURI:'https://ipfs.io/ipfs/bafybeicg3noennhgwjepstuusxhfo2aigursmq7tdlkwijwln5e5ttos4m'},
    {dataURI:'https://ipfs.io/ipfs/bafybeidd7syfuwaarddndz6wvwzanbjqqwbry5pqfc3l5kwuxtd75xneoq'},
    {dataURI:'https://ipfs.io/ipfs/bafybeibi4xdec4xxy27pbhdcqn5ntvl2wi6qzjcoe4wpuewojjpwa7yuie'},
    {dataURI:'https://ipfs.io/ipfs/bafybeihponuvg6qk2vuna3icnwonnkufzddhj5hfpwxrbdbefnsiqadbhe'},
    {dataURI:'https://ipfs.io/ipfs/bafybeidztsjtlpxuya4exc4vyhqnxxncmsoeprrrd5wo4rkijhyr5rxr2y'},
    {dataURI:'https://ipfs.io/ipfs/bafybeifgjikfedbubmsgppikbl5fccdbjsgitsqgvbk6fhdhcajmrrfhb4'},
    {dataURI:'https://ipfs.io/ipfs/bafybeihx5iloylvzrynibxz77qlsnl44pxh6x3t6y333veikfdqngwwcka'},
    {dataURI:'https://ipfs.io/ipfs/bafybeifocns76bdxzcb2xsro6hweou2d242lne7xuazrqqpnhveeaqxm7a'}
];

const Nav = () => {
    const router = useRouter();
    const {authenticate, setUserData, user, isAuthenticated, logout} = useMoralis();
    const [loadingState, setLoadingState] = useState("not-loaded");
    const [walletAddress, setWalletAddress] = useState("not-set");
    const [badges, setBadges] = useState(0);
    const [avatarOpen, setAvatarOpen] = useState(false);
    const [avatar, setAvatar] = useState("");
    // walletConnected keep track of whether the user's wallet is connected or not
    const [walletConnected, setWalletConnected] = useState(false);
    const web3ModalRef = useRef();

    useEffect(() => {
        moralisAuthenticate();
        setLoadingState("loaded");
    }, []);


    function logoutSummitC() {
       // ToDo Lens
        if (isAuthenticated) logout();
        router.push("/");
    }

    function moralisAuthenticate() {
        if (!isAuthenticated) {
            authenticate().then((result) => {
                console.log(JSON.stringify(result));
            });
        }
    }

    function avatarClick(e: any) {
        e.preventDefault();
        setAvatarOpen(true);
    }

    const changeAvatar = async (selectedAvatar: any) => {
        setAvatar(selectedAvatar.dataURI);
        setUserData({
            avatar: selectedAvatar.dataURI === "" ? undefined : selectedAvatar.dataURI,
        });
        /*
        const UserObj = Moralis.Object.extend("User");
        if (UserObj) {
            const publicUser = new UserObj();
            const postACL = new Moralis.ACL(Moralis.User.current());
            postACL.setPublicReadAccess(true);
            if (user && user.id) {
                publicUser.set("id", user.id);
            }
            publicUser.setACL(postACL);
            publicUser.save();

        } */
        // save to LensProfile
        toast.success(" Profile picture Saved!", {
            position: toast.POSITION.BOTTOM_CENTER,
        });
        setAvatarOpen(false);
        // await mintProfileAvatar(selectedAvatar.dataURI);
    }

    // @ts-ignore
    return (
        <nav>
            <Link href="/Home" passHref>
                <a className={styles.logo}>Home</a>
            </Link>
            <div className={styles.rightNav}>
                {loadingState == "loaded" && avatarOpen && (
                    <>
                        <ModalTransition>
                            <AvatarPickerDialog
                                avatars={avatars}
                                onImagePicked={(selectedImage, crop) => {
                                    console.log(selectedImage.size, crop.x, crop.y, crop.size);
                                }}
                                onAvatarPicked={(selectedAvatar) => {
                                    changeAvatar(selectedAvatar);
                                }}

                                onCancel={() => setAvatarOpen(false)}
                            />
                        </ModalTransition>
                    </>
                )}

                {loadingState == "loaded" && (
                    <button className={styles.logout} onClick={logoutSummitC}>
                        <span>Log Out</span>
                    </button>
                )}
                {loadingState == "loaded" && avatar && (
                    <Avatar onClick={avatarClick}
                            alt=""
                            src={avatar}
                    />
                )}
                {loadingState == "loaded" && user && !avatar && (
                    <Avatar onClick={avatarClick}
                            alt=""
                            src=""
                    />
                )}
                {loadingState == "not-loaded" &&
                    <div className="loader-center">
                        <div className="loader"></div>
                    </div>}
                <div className={styles.displayNone} id="console">
                    <p className={styles.code}></p>
                </div>
            </div>
        </nav>
    );
};
export default Nav;
