import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class Signin extends Component {
  state = {
    name: "",
    password: "",
    email: "",
  };

  savetoState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  clearState = () => {
    this.setState({ name: "", email: "", password: "" });
  };
  render() {
    return (
      <Mutation
        mutation={REQUEST_RESET_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(reset, { error, loading, called }) => (
          <Form
            method='post'
            onSubmit={async e => {
              e.preventDefault();
              await reset();
              this.setState({ email: "" });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Request a Password Reset</h2>
              <Error error={error} />
              {!error && !loading && called && (
                <p>Success! Check your email for the reset token</p>
              )}
              <label htmlFor='email'>
                Email
                <input
                  type='text'
                  name='email'
                  placeholder='email'
                  value={this.state.email}
                  onChange={this.savetoState}
                />
              </label>

              <button type='submit'>Request Reset</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Signin;
