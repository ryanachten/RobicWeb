const dev = "http://localhost:4000/graphql";
const test = "https://robic-server.herokuapp.com/graphql";
const prod = "https://robic-server.herokuapp.com/graphql";

const getUrl = () => {
  console.log("process.env.NODE_ENV", process.env.NODE_ENV);

  switch (process.env.NODE_ENV) {
    case "development":
      return dev;
    case "test":
      return test;
    case "production":
      return prod;
    default:
      return prod;
  }
};

export const API_URL = getUrl();
