import { useState } from 'react';
import MessageItem from "./MessageItem";
import MessageInput from './MessageInput';

const MessageList = () => {
  const [messages, setMessages] = useState([...Array(5)].map((_, i) => ({ id: i + 1, userID: `id_${i}`, timestamp: 1234567890123 + i * 1000 * 60, text: `${i + 1} mock test` })))
  const onCreate = text => {
    const newMessage = {
      id: messages.length + 1,
      userID: `id_${messages.length + 1}`,
      timestamp: Date.now(),
      text: `${messages.length + 1} 추가한 데이터: ${text}`
    }
    setMessages([newMessage, ...messages])
  }
  return (
    <>
      <MessageInput mutate={onCreate} />
      <ul className="messages">
        {
          messages.map(x => <MessageItem key={x.id} {...x} />)
        }
      </ul>
    </>
  )

}
export default MessageList;