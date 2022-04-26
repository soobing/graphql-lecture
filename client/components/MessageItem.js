import MessageInput from "./MessageInput";

const MessageItem = ({ id, myID, userID, timestamp, text, onUpdate, edit, onClickEdit, onDelete }) => (
  <li className="messages__item">
    <h3>{userID}{' '}
      <sub>
        {new Date(timestamp).toLocaleString('ko-KR', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}
      </sub></h3>
    {
      edit ? <MessageInput mutate={onUpdate} id={id} text={text} /> : text
    }
    {
      myID === userID && <div className="messages__buttons">
      <button onClick={onClickEdit}>수정</button>
        <button onClick={onDelete}>삭제</button>
      </div>
    }
  </li>
)

export default MessageItem;