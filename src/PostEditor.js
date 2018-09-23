import React from 'react';
import gql from 'graphql-tag';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { Form as FinalForm, Field } from 'react-final-form';

import client from './apollo';
import { GET_POSTS } from './PostViewer';

const SUBMIT_POST = gql`
  mutation SubmitPost($input: PostInput!) {
    submitPost(input: $input) {
      id
    }
  }
`;

const PostEditor = ({ post, onClose }) => (
  <FinalForm
    onSubmit={async ({ id, body }) => {
      const input = { id, body };

      await client.mutate({
        variables: { input },
        mutation: SUBMIT_POST,
        refetchQueries: () => [{ query: GET_POSTS }],
      });

      onClose();
    }}
    initialValues={post}
    render={({ handleSubmit, pristine, invalid }) => (
      <Modal isOpen toggle={onClose}>
        <Form onSubmit={handleSubmit}>
          <ModalHeader toggle={onClose}>
            {post.id ? 'Edit Post' : 'New Post'}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Body</Label>
              <Field
                required
                name="body"
                className="form-control"
                component="input"
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" disabled={pristine} color="primary">Save</Button>
            <Button color="secondary" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </Form>
      </Modal>
    )}
  />
);

export default PostEditor;
