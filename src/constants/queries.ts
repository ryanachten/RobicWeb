import gql from "graphql-tag";

export const GetCurrentUser = gql`
  {
    currentUser {
      id
      email
      firstName
      lastName
    }
  }
`;
