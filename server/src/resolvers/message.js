import { v4 } from 'uuid'
import { writeDB } from '../dbController.js'

const setMessages = (messages) => writeDB('messages', messages);

/**
 * obj: parent 객체. 거의 사용 X.
 * args: Query에 필요한 필드에 제공되는 인수(parameter)
 * context: 로그인한 사용자. DB Access 등의 중요한 정보들
 */
const messageResolver = {
  Query: {
    messages: (parent, args, { db }) => {
      return db.messages;
    },
    message: (parent, { id = '' }, { db }) => {
      return db.messages.find(({ id: _id }) => _id === id)
    }
  },
  Mutation: {
    createMessage: (parent, { text, userID }, { db }) => {
      const newMessage = {
        id: v4(),
        text,
        userID,
        timestamp: Date.now()
      }
      db.messages.unshift(newMessage);
      setMessages(db.messages)
      return newMessage
    },
    updateMessage: (parent, { id, text, userID }, { db }) => {
      const targetIndex = db.messages.findIndex(({ id: _id }) => _id === id);

      if (targetIndex < 0) throw Error('메세지가 없습니다.');
      if (db.messages[targetIndex].userID !== userID) throw Error('사용자가 다릅니다.');

      const newMessage = { ...db.messages[targetIndex], text: text };
      db.messages.splice(targetIndex, 1, newMessage);
      setMessages(db.messages);
      return newMessage
    },
    deleteMessage: (parent, { id, userID }, { db }) => {
      const targetIndex = db.messages.findIndex((message) => message.id === id);
      if (targetIndex < 0) throw '메세지가 없습니다.';
      if (db.messages[targetIndex].userID !== userID) throw '사용자가 다릅니다.';

      db.messages.splice(targetIndex, 1);
      setMessages(db.messages);
      return id;
    }
  },
}


// const messagesRoute = [
//   {
//     method: 'get',
//     route: '/messages',
//     handler: ({ query: { cursor = '' } }, res) => {
//       const messages = getMessages();
//       const fromIndex = messages.findIndex(({ id }) => id === cursor) + 1;
//       res.send(messages.slice(fromIndex, fromIndex + 15))
//     }
//   },
//   {
//     method: 'get',
//     route: '/messages/:id',
//     handler: ({ params: { id } }, res) => {
//       try {
//         const messages = getMessages();
//         const message = messages.find((message) => message.id === id);
//         if (!message) throw Error('not found');
//         res.send(message);
//       } catch (err) {
//         res.status(404).send({ error: err })
//       }
//     }
//   },
//   {
//     method: 'post',
//     route: '/messages',
//     handler: ({ body }, res) => {
//       const messages = getMessages();
//       const newMessage = {
//         id: v4(),
//         text: body.text,
//         userID: body.userID,
//         timestamp: Date.now()
//       }
//       messages.unshift(newMessage);
//       setMessages(messages)
//       res.send(messages)
//     }
//   },
//   {
//     method: 'put',
//     route: '/messages/:id',
//     handler: ({ body, params: { id } }, res) => {
//       try {
//         const messages = getMessages();
//         const targetIndex = messages.findIndex((message) => message.id === id);

//         if (targetIndex < 0) throw '메세지가 없습니다.';
//         if (messages[targetIndex].userID !== body.userID) throw '사용자가 다릅니다.';
//         const newMessage = { ...messages[targetIndex], text: body.text };
//         messages.splice(targetIndex, 1, newMessage);
//         setMessages(messages);
//         res.send(newMessage);
//       } catch (err) {
//         res.status(500).send({ error: err })
//       }
//     }
//   },
//   {
//     method: 'delete',
//     route: '/messages/:id',
//     handler: ({ body, params: { id }, query: { userID } }, res) => {
//       try {
//         const messages = getMessages();
//         const targetIndex = messages.findIndex((message) => message.id === id);
//         if (targetIndex < 0) throw '메세지가 없습니다.';
//         if (messages[targetIndex].userID !== userID) throw '사용자가 다릅니다.';

//         messages.splice(targetIndex, 1);
//         setMessages(messages);
//         res.send(id);
//       } catch (err) {
//         res.status(500).send({ error: err })
//       }
//     }
//   }
// ]

export default messageResolver;