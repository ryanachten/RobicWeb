import gql from "graphql-tag";

export const LoginUser = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password)
  }
`;

export const RegisterUser = gql`
  mutation RegisterUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    registerUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      id
    }
  }
`;

export const AddExerciseDefinition = gql`
  mutation AddExerciseDefinition(
    $title: String!
    $unit: String!
    $primaryMuscleGroup: [String]!
    $type: String!
    $childExercises: [ID]!
  ) {
    addExerciseDefinition(
      title: $title
      unit: $unit
      primaryMuscleGroup: $primaryMuscleGroup
      type: $type
      childExercises: $childExercises
    ) {
      id
    }
  }
`;

export const AddExercise = gql`
  mutation AddExercise(
    $definitionId: ID!
    $sets: [SetInput]!
    $timeTaken: String!
  ) {
    addExercise(
      definitionId: $definitionId
      sets: $sets
      timeTaken: $timeTaken
    ) {
      id
    }
  }
`;

export const UpdateExercise = gql`
  mutation UpdateExerciseDefinition(
    $exerciseId: ID!
    $title: String!
    $unit: String!
    $primaryMuscleGroup: [String]!
    $type: String!
    $childExercises: [ID]!
  ) {
    updateExerciseDefinition(
      exerciseId: $exerciseId
      title: $title
      unit: $unit
      primaryMuscleGroup: $primaryMuscleGroup
      type: $type
      childExercises: $childExercises
    ) {
      id
    }
  }
`;
