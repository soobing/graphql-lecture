import { useState } from 'react';
import MessageItem from "./MessageItem";
import MessageInput from './MessageInput';

const MessageList = () => {
  const [messages, setMessages] = useState([...Array(50)].map((_, i) => ({ id: i + 1, userID: `id_${i}`, timestamp: 1234567890123 + i * 1000 * 60, text: `${i + 1} mock test` })));
  const [editID, setEditID] = useState(null);

  const onCreate = text => {
    const newMessage = {
      id: messages.length + 1,
      userID: `id_${messages.length + 1}`,
      timestamp: Date.now(),
      text: `${messages.length + 1} 추가한 데이터: ${text}`
    }
    setMessages([newMessage, ...messages])
  }

  const onUpdate = (text, id) => {
    setMessages(messages => {
      const targetIndex = messages.findIndex(msg => msg.userID === id);
      if (targetIndex < 0) return messages;
      const newMessages = [...messages];
      newMessages.splice(targetIndex, 1, {
        ...newMessages[targetIndex],
        text
      })
      return newMessages;
    });
    setEditID(null)
  }

  const onDelete = (id) => {
    setMessages(messages => {
      const targetIndex = messages.findIndex(msg => msg.userID === id);
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
          messages.map(x => <MessageItem key={x.id} onClickEdit={(id) => setEditID(x.userID)} onUpdate={onUpdate} edit={x.userID === editID} onDelete={() => onDelete(x.userID)} {...x} />)
        }
      </ul>
    </>
  )

}
export default MessageList;