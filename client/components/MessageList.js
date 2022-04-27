import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import { fetcher, QueryKeys } from '../queryClient';

import MessageItem from "./MessageItem";
import MessageInput from './MessageInput';
import { GET_MESSAGES, CREATE_MESSAGE, UPDATE_MESSAGE, DELETE_MESSAGE } from '../graphql/message'

// import useInfiniteScroll from '../hooks/useInfiniteScroll';

const MessageList = ({ defaultMessages }) => {
  const client = useQueryClient();
  const { query: { userID = '' } } = useRouter();
  const [messages, setMessages] = useState(defaultMessages);
  const [editID, setEditID] = useState(null);

  const { data, error, isError } = useQuery(QueryKeys.MESSAGES, () => fetcher(GET_MESSAGES));

  const { mutate: onCreate } = useMutation(({ text }) => fetcher(CREATE_MESSAGE, { text, userID }, {
    onSuccess: ({ createMessage }) => {
      client.setQueryData(QueryKeys.MESSAGES, old => {
        return {
          messages: [createMessage, ...old.messages]
        }
      })
    }
  }))

  const { mutate: onUpdate } = useMutation(({ text, id }) => fetcher(UPDATE_MESSAGE, { text, id, userID }), {
    onSuccess: ({ updateMessage }) => {
      client.setQueryData(QueryKeys.MESSAGES, old => {
        const targetIndex = old.messages.findIndex(message => message.id === updateMessage.id);
        if (targetIndex < 0) return old;
        const newMessages = [...old.messages];
        newMessages.splice(targetIndex, 1, updateMessage)
        return { messages: newMessages }
      })
      setEditID(null)

    }
  })

  const { mutate: onDelete } = useMutation(id => fetcher(DELETE_MESSAGE, { id, userID }), {
    onSuccess: ({ deletedMessage: deletedID }) => {
      client.setQueryData(QueryKeys.MESSAGES, old => {
        const targetIndex = old.messages.findIndex(message => message.id === deletedID);
        if (targetIndex < 0) return old;
        const newMessages = [...old.messages];
        newMessages.splice(targetIndex, 1)
        return { messages: newMessages }
      })
    }
  })

  useEffect(() => {
    data?.messages && setMessages(data?.messages)
  }, [data?.messages]);

  if (isError) {
    console.error(error);
    return null;
  }

  /*
  const [hasNext, setHasNext] = useState(true);
  const moreEl = useRef(null);
  const intersecting = useInfiniteScroll(moreEl);
  useEffect(() => {
    intersecting && hasNext && getMessages();
  }, [intersecting])
 */


  return (
    <>
      {userID && <MessageInput mutate={onCreate} />}
      <ul className="messages">
        {
          messages.map(x => <MessageItem key={x.id} onClickEdit={(id) => setEditID(x.id)} onUpdate={onUpdate} edit={x.id === editID} onDelete={() => onDelete(x.id)} myID={userID} {...x} />)
        }
      </ul>
      {/* <div ref={moreEl}></div> */}
    </>
  )

}
export default MessageList;