require('dotenv').config({ path: '.env.local' });

const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const gql = require('graphql-tag');
const { buildASTSchema } = require('graphql');
const { Client } = require('@okta/okta-sdk-nodejs');
const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  issuer: `${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`,
});

const client = new Client({
  orgUrl: process.env.REACT_APP_OKTA_ORG_URL,
  token: process.env.REACT_APP_OKTA_TOKEN,
});

const AUTHORS = {};
const POSTS = [];

const schema = buildASTSchema(gql`
  type Query {
    posts: [Post]
    post(id: ID): Post
  }

  type Mutation {
    submitPost(input: PostInput!): Post
  }

  input PostInput {
    id: ID
    body: String
  }

  type Post {
    id: ID
    author: Author
    body: String
  }

  type Author {
    id: ID
    name: String
  }
`);

const mapPost = (post, id) => post && ({
  ...post,
  id,
  author: AUTHORS[post.authorId],
});

const getUserId = async ({ authorization }) => {
  try {
    const accessToken = authorization.trim().split(' ')[1];
    const { claims: { uid } } = await oktaJwtVerifier.verifyAccessToken(accessToken);

    if (!AUTHORS[uid]) {
      const { profile: { firstName, lastName } } = await client.getUser(uid);

      AUTHORS[uid] = {
        id: uid,
        name: [firstName, lastName].filter(Boolean).join(' '),
      };
    }

    return uid;
  } catch (error) {
    return null;
  }
};

const root = {
  posts: () => POSTS.map(mapPost),
  post: ({ id }) => mapPost(POSTS[id], id),
  submitPost: async ({ input: { id, body } }, { headers }) => {
    const authorId = await getUserId(headers);
    if (!authorId) return null;

    const post = { authorId, body };
    let index = POSTS.length;

    if (id != null && id >= 0 && id < POSTS.length) {
      POSTS.splice(id, 1, post);
      index = id;
    } else {
      POSTS.push(post);
    }

    return mapPost(post, index);
  },
};

const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

const port = process.env.PORT || 4000
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);
