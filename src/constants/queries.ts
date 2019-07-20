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
      type
      childExercises {
        id
        title
        unit
      }
      primaryMuscleGroup
      history {
        date
        sets {
          reps
          value
          exercises {
            id
            reps
            value
          }
        }
        timeTaken
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

export const GetExerciseDefinitionById = gql`
  query GetExerciseDefinition($exerciseId: ID!) {
    exerciseDefinition(id: $exerciseId) {
      id
      title
      unit
      primaryMuscleGroup
      type
      childExercises {
        id
        primaryMuscleGroup
        title
      }
      history {
        date
        sets {
          reps
          value
          exercises {
            id
            reps
            value
          }
        }
        timeTaken
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
