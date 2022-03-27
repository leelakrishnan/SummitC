import { gql } from '@apollo/client/core';
import { apolloClient } from './apollo-client';
import { prettyJSON } from './helpers';

const WHO_COLLECTED = `
  query($request: WhoCollectedPublicationRequest!) {
    whoCollectedPublication(request: $request) {
      items {
      defaultProfile {
        bio
        handle
        id
        location
        name
        twitterUrl
        website
      }
    }
    }
  }
`;

export const whoCollectedEvent = (whoCollectedPublicationRequest2: any) => {
    return apolloClient.mutate({
        mutation: gql(WHO_COLLECTED),
        variables: {
            request: {
                follow: whoCollectedPublicationRequest2,
            },
        },
    });
};
