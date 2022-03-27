import { gql } from '@apollo/client/core';
import { apolloClient } from './apollo-client';
import { prettyJSON } from './helpers';

const GET_EVENTS_SOURCE = `
    query($request: ExplorePublicationRequest!) {
    profiles(request: $request) {
    items { 
      ... on Post {
        metadata {
          content
        }
      }
      }
      pageInfo {
        prev
        next
        totalCount
    }
  }
  }
`;

export interface ExplorePublicationBySourceAndPublicationType {
    sortCriteria: string;
    publicationTypes?: string;
    sources?: string[];
}

const getExplorePublicationBySourceAndPublicationType = (request: ExplorePublicationBySourceAndPublicationType) => {
    return apolloClient.query({
        query: gql(GET_EVENTS_SOURCE),
        variables: {
            request,
        },
    });
};

export const getEventsByPublicationBySourceAndPublicationType  = async (request?: ExplorePublicationBySourceAndPublicationType) => {
    
    // only showing one example to query but you can see from request
    // above you can query many
    const eventsHappening = await getExplorePublicationBySourceAndPublicationType(request);
    prettyJSON('profiles: result', eventsHappening.data);
    return eventsHappening.data;
};
