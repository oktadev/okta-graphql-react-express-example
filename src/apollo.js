import ApolloClient from 'apollo-boost';

let auth;

export const updateAuth = (newAuth) => {
  auth = newAuth;
};

export default new ApolloClient({
  uri: "http://localhost:4000/graphql",
  request: async (operation) => {
    const token = await auth.getAccessToken();
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  },
});
