import { v4 } from 'uuid'
import { readDB, writeDB } from '../dbController.js'

const getMessages = () => readDB('messages');
const setMessages = (messages) => writeDB('messages', messages);

const messagesRoute = [
  {
    method: 'get',
    route: '/messages',
    handler: (req, res) => {
      const messages = getMessages();
      res.send(messages)
    }
  },
  {
    method: 'get',
    route: '/messages/:id',
    handler: ({ params: { id } }, res) => {
      try {
        const messages = getMessages();
        const message = messages.find((message) => message.id === id);
        if (!message) throw Error('not found');
        res.send(message);
      } catch (err) {
        res.status(404).send({ error: err })
      }
    }
  },
  {
    method: 'post',
    route: '/messages',
    handler: ({ body }, res) => {
      const messages = getMessages();
      const newMessage = {
        id: v4(),
        text: body.text,
        userID: body.userID,
        timestamp: Date.now()
      }
      messages.unshift(newMessage);
      setMessages(messages)
      res.send(messages)
    }
  },
  {
    method: 'put',
    route: '/messages/:id',
    handler: ({ body, params: { id } }, res) => {
      try {
        const messages = getMessages();
        const targetIndex = messages.findIndex((message) => message.id === id);

        if (targetIndex < 0) throw '메세지가 없습니다.';
        if (messages[targetIndex].userID !== body.userID) throw '사용자가 다릅니다.';
        const newMessage = { ...messages[targetIndex], text: body.text };
        messages.splice(targetIndex, 1, newMessage);
        setMessages(messages);
        res.send(newMessage);
      } catch (err) {
        res.status(500).send({ error: err })
      }
    }
  },
  {
    method: 'delete',
    route: '/messages/:id',
    handler: ({ body, params: { id }, query: { userID } }, res) => {
      try {
        const messages = getMessages();
        const targetIndex = messages.findIndex((message) => message.id === id);
        if (targetIndex < 0) throw '메세지가 없습니다.';
        if (messages[targetIndex].userID !== userID) throw '사용자가 다릅니다.';

        messages.splice(targetIndex, 1);
        setMessages(messages);
        res.send(id);
      } catch (err) {
        res.status(500).send({ error: err })
      }
    }
  }
]

export default messagesRoute;