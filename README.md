# SummitC

> Leela -3 point for documentation.

    1. No readme in intial main
    2. no feedback or edits to initial documentation by tippi
    3. no additional comments and missing .env information

> Tippi +2 points for documentation.

    1. created this readme
    2. extended documentation, including finding previously written documentation (and .env info) from the discarded first fork up.

**To run locally, navigate to my-app, npm install, and npm run dev. then open localhost:3000 in your browser**

### important folders:

0. root: **example-env** \*\*\*\*\*(make sure to put a .env file in your my-app folder, follow the example)
1. my-app/ \*\*\*\*\*(navigate here to install and run locally, check that readme.md for more)
2. documentation-points/ \*\*\*\*\*(change directory to delve into the specification and Potentially Pointless Over-Documentation)
3. my-app/pages/ \*\*\*\*\*(thanks to Next.js, can easily add new routes here)
4. my-app/pages/api \*\*\*\*\*(not sure what this is about though, "john doe")
5. my-app/lens-mutation \*\*\*\*\*(???)
6. my-app/styles \*\*\*\*\*(css modules and global css)

## our story

1. We spent a month building software to improve team building and hackathon project management for the Faber Hackathon (FLYTV = Flight V).
1. [Building on Lens](https://www.youtube.com/watch?v=2ex8Ns4MzZk) We started Building on Lens thanks to the ETHGlobal LFGrow Hackathon, in which we continue our quest, but starting again from scratch (and then again from scratch when we realized the rules!)
1. we stuck together because we had good teamwork and good momentum on an unstoppable idea (improve our own ecosystem and time travel into the future to fix the problems that we tripped over on our own journey!)
1. with a few days left before the deadline, thanks to Lenster Yogi for tipping us off that we were heading down [a path towards disaster](https://github.com/leelakrishnan/SummitCenter)
1. we want you to contribute to this open source problem, give us feedback and love for our hard work on this project, and hope you fork and have fun with this Proof of Concept!

_Lens Protocol Smart Contracts enable users to own and transfer their profile, because it is an **NFT**._ See contracts/ folder LensHub.sol.

```solidity
/**
 * @notice A struct containing profile data.
 *
 * @param pubCount The number of publications made to this profile.
 * @param followNFT The address of the followNFT associated with this profile, can be empty..
 * @param followModule The address of the current follow module in use by this profile, can be empty.
 * @param handle The profile's associated handle.
 * @param uri The URI to be displayed for the profile NFT.
 */
struct ProfileStruct {
    uint256 pubCount;
    address followNFT;
    address followModule;
    string handle;
    string uri;
}
```

1. this could be useful for someone managing an account who is part of a team, or wants to put someone else in charge of the posting
2. the string uri can point to a profile picture, or a json object in IPFS.
3. there are three base types of publication that any profile owner can publish:

- Post
- Comment
- Mirror.

**Profile owners can also set and initialize the Follow Module associated with their profile.**

Publications are on-chain content created and published via profiles. Profile owners can create (publish) three publication types, outlined below. They are represented by a PublicationStruct (See contracts/ folder LensHub.sol.)

```solidity
/**
 * @notice A struct containing data associated with each new publication.
 *
 * @param profileIdPointed The profile token ID this publication points to, for mirrors and comments.
 * @param pubIdPointed The publication ID this publication points to, for mirrors and comments.
 * @param contentURI The URI associated with this publication.
 * @param referenceModule The address of the current reference module in use by this profile, can be empty.
 * @param collectModule The address of the collect module associated with this publication, this exists for all publication.
 * @param collectNFT The address of the collectNFT associated with this publication, if any.
 */
struct PublicationStruct {
    uint256 profileIdPointed;
    uint256 pubIdPointed;
    string contentURI;
    address referenceModule;
    address collectModule;
    address collectNFT;
}
```

From these humble building blocks, we will build a UI to make it simple to publish a post, an event (such as a summit), register for a hackathon, form a team, and **most importantly, check that all participants understand the rules**

### screenshots

![image](https://user-images.githubusercontent.com/62179036/160152530-410488c7-e6e4-4129-9073-a281b30e72be.png)
