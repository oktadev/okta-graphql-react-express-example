import React from 'react';
import { withAuth } from '@okta/okta-react';

import { updateAuth } from './apollo';

export default Component => withAuth(class WithAuth extends React.Component {
  state = {
    ...this.props.auth,
    authenticated: null,
    user: null,
    loading: true,
  };

  componentDidMount() {
    this.updateAuth();
  }

  componentDidUpdate() {
    this.updateAuth();
  }

  async updateAuth() {
    updateAuth(this.props.auth);

    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      const user = await this.props.auth.getUser();
      this.setState({ authenticated, user, loading: false });
    }
  }

  render() {
    const { auth, ...props } = this.props;
    return <Component {...props} auth={this.state} />;
  }
});
