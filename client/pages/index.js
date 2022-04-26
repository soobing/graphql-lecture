import MessageList from '../components/MessageList'
import fetcher from '../fetcher';

const Home = ({ messages }) => <>
  <h1>Simple SNS</h1>
  <MessageList defaultMessages={messages} />
</>

export const getServerSideProps = async () => {
  const messages = await fetcher('get', '/messages');
  return {
    props: { messages }
  }
}
export default Home;