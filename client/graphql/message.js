// import gql from 'graphql-tag';
import { gql } from 'graphql-request';

export const GET_MESSAGES = gql`
  query GET_MESSAGES {
    messages {
      id
      text
      userID
      timestamp
    }
  }
`

export const GET_MESSAGE = gql`
  query GET_MESSAGE($id: ID!) {
    message(id: $id) {
      id
      text
      userID
      timestamp
    }
  }
`

export const CREATE_MESSAGE = gql`
  mutation CREATE_MESSAGE($text: String!, $userID: ID!) {
    createMessage(text: $text, userID: $userID) {
      id
      text
      userID
      timestamp
    }
  }
`

export const UPDATE_MESSAGE = gql`
  mutation UPDATE_MESSAGE($id: ID!, $text: String!, $userID: ID!) {
    updateMessage(id: $id, text: $text, userID: $userID) {
      id
      text
      userID
      timestamp
    }
  }
`

export const DELETE_MESSAGE = gql`
  mutation DELETE_MESSAGE($id: ID!, $userID: ID!) {
    deleteMessage(id: $id, userID: $userID)
  }
`