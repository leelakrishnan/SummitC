# SummitC

> Leela -1 point for documentation.

**To run locally, navigate to my-app, npm install, and npm run dev. then open localhost:3000 in your browser**

## our story

Lens Protocol Smart Contracts enable users to own and transfer their profile, because it is an nft.  See contracts/ folder LensHub.sol.

``` solidity
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

``` solidity
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
