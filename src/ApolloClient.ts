import ApolloClient from "apollo-boost";
import { API_URL } from "./constants/API";

const client = new ApolloClient({
  uri: API_URL,
  request: async operation => {
    const token = window.localStorage.getItem("token");
    operation.setContext({
      headers: {
        authorization: token
      }
    });
  }
});

export default client;
