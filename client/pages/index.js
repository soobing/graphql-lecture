import MessageList from '../components/MessageList'
import { fetcher } from '../queryClient';
import { GET_MESSAGES } from '../graphql/message'

const Home = ({ messages }) => <>
  <h1>Simple SNS</h1>
  <MessageList defaultMessages={messages} />
</>

export const getServerSideProps = async () => {
  const { messages } = await fetcher(GET_MESSAGES);

  return {
    props: { messages }
  }
}
export default Home;