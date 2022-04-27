import { gql } from 'apollo-server-express';

const messageSchema = gql`
  type Message {
    id: ID!
    text: String!
    userID: ID!
    timestamp: Float
  }

  extend type Query {
    messages: [Message!]!
    message(id: ID!): Message!
  }

  extend type Mutation {
    createMessage(text: String!, userID: ID!): Message!
    updateMessage(id: ID!, text: String!, userID: ID!): Message!
    deleteMessage(id: ID!, userID: ID!): ID!
  }
`



export default messageSchema;