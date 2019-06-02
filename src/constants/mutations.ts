import gql from "graphql-tag";

export const LoginUser = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password)
  }
`;

export const CreateExercise = gql`
  mutation AddExerciseDefinition($title: String!, $unit: String!) {
    addExerciseDefinition(title: $title, unit: $unit) {
      id
    }
  }
`;
