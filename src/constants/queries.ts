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

export const GetExercises = gql`
  {
    exerciseDefinitions {
      id
      title
      unit
      history {
        session {
          date
        }
      }
      personalBest {
        value {
          value
        }
        setCount {
          value
        }
        totalReps {
          value
        }
        netValue {
          value
        }
        timeTaken {
          value
        }
      }
    }
  }
`;
