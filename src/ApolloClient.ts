import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  // uri: "https://robic-server.herokuapp.com/graphql",
  uri: "http://localhost:4000/graphql",
  request: async operation => {
    const token = window.localStorage.getItem("token");
    console.log("retrieved token", token);
    operation.setContext({
      headers: {
        authorization: token
      }
    });
  }
});

export default client;
