import React, { Component } from 'react';
import { Button, Container } from 'reactstrap';

import PostViewer from './PostViewer';
import PostEditor from './PostEditor';
import withAuth from './withAuth';

class App extends Component {
  state = {
    editing: null,
  };

  render() {
    const { auth } = this.props;
    if (auth.loading) return null;

    const { user, login, logout } = auth;
    const { editing } = this.state;

    return (
      <Container fluid>
        {user ? (
          <div>
            <Button
              className="my-2"
              color="primary"
              onClick={() => this.setState({ editing: {} })}
            >
              New Post
            </Button>
            <Button
              className="m-2"
              color="secondary"
              onClick={() => logout()}
            >
              Sign Out (signed in as {user.name})
            </Button>
          </div>
        ) : (
          <Button
            className="my-2"
            color="primary"
            onClick={() => login()}
          >
            Sign In
          </Button>
        )}
        <PostViewer
          canEdit={() => true}
          onEdit={(post) => this.setState({ editing: post })}
        />
        {editing && (
          <PostEditor
            post={editing}
            onClose={() => this.setState({ editing: null })}
          />
        )}
      </Container>
    );
  }
}

export default withAuth(App);
