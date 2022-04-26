import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MessageItem from "./MessageItem";
import MessageInput from './MessageInput';

import fetcher from '../fetcher';

const MessageList = () => {
  const { query: { userID = '' } } = useRouter();
  const [messages, setMessages] = useState([]);
  const [editID, setEditID] = useState(null);

  useEffect(() => {
    getMessages();
  }, [])

  const getMessages = async () => {
    const messages = await fetcher('get', '/messages');
    setMessages(messages)
  }

  const onCreate = async text => {
    const newMessage = await fetcher('post', '/messages', { text, userID })
    if (!newMessage) return;

    setMessages(newMessage)
  }

  const onUpdate = async (text, id) => {
    const newMessage = await fetcher('put', `/messages/${id}`, { text, userID })
    if (!newMessage) return;
    setMessages(messages => {
      const targetIndex = messages.findIndex(msg => msg.id === id);
      if (targetIndex < 0) return messages;
      const newMessages = [...messages];
      newMessages.splice(targetIndex, 1, newMessage)
      return newMessages;
    });
    setEditID(null)
  }

  const onDelete = async (id) => {
    const deletedId = await fetcher('delete', `/messages/${id}`, { params: { userID } })

    setMessages(messages => {
      const targetIndex = messages.findIndex(msg => msg.id === String(deletedId));
      if (targetIndex < 0) return messages;
      const newMessages = [...messages];
      newMessages.splice(targetIndex, 1)
      return newMessages;
    });
  }

  return (
    <>
      <MessageInput mutate={onCreate} />
      <ul className="messages">
        {
          messages.map(x => <MessageItem key={x.id} onClickEdit={(id) => setEditID(x.id)} onUpdate={onUpdate} edit={x.id === editID} onDelete={() => onDelete(x.id)} myID={userID} {...x} />)
        }
      </ul>
    </>
  )

}
export default MessageList;