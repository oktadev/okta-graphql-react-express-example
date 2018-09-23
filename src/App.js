import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
  Table,
} from 'reactstrap';

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      author
      body
    }
  }
`;

class App extends Component {
  render() {
    return (
      <Query query={GET_POSTS}>
        {({ loading, data }) => !loading && (
          <Table>
            <thead>
              <tr>
                <th>Author</th>
                <th>Body</th>
              </tr>
            </thead>
            <tbody>
              {data.posts.map(post => (
                <tr key={post.id}>
                  <td>{post.author}</td>
                  <td>{post.body}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Query>
    );
  }
}

export default App;
