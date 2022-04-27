import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MessageItem from "./MessageItem";
import MessageInput from './MessageInput';

import { fetcher } from '../queryClient';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const MessageList = ({ defaultMessages }) => {
  return null;
  const { query: { userID = '' } } = useRouter();
  const [messages, setMessages] = useState(defaultMessages);
  const [hasNext, setHasNext] = useState(true);

  const [editID, setEditID] = useState(null);
  const moreEl = useRef(null);
  const intersecting = useInfiniteScroll(moreEl);


  useEffect(() => {
    intersecting && hasNext && getMessages();
  }, [intersecting])

  const getMessages = async () => {
    const newMessages = await fetcher('get', '/messages', { params: { cursor: messages[messages.length - 1]?.id ?? '' } });
    if (newMessages.length === 0) {
      setHasNext(false);
      return;
    }
    setMessages((messages) => [...messages, ...newMessages])
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
      {userID && <MessageInput mutate={onCreate} />}
      <ul className="messages">
        {
          messages.map(x => <MessageItem key={x.id} onClickEdit={(id) => setEditID(x.id)} onUpdate={onUpdate} edit={x.id === editID} onDelete={() => onDelete(x.id)} myID={userID} {...x} />)
        }
      </ul>
      <div ref={moreEl}></div>
    </>
  )

}
export default MessageList;