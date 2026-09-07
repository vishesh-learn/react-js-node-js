import { io, Socket } from 'socket.io-client';
import './App.scss';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

interface MessageData {
  author: string;
  text: string;
}

interface ServerToClientEvents {
  message: (data: MessageData) => void;
  hello: (data: string) => void;
  connectionCount: (data: number) => void;
}

const socket: Socket<ServerToClientEvents> = io(import.meta.env.VITE_API_URL);

function App() {
  const [wsConnected, setWSConnected] = useState(false);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [connectionCount, setConnectionCount] = useState<number>(0);

  useEffect(() => {
    socket.on('connect', () => setWSConnected(true));

    socket.on('message', (data) => setMessages((prev) => [...prev, data]));

    socket.on('connectionCount', (data) => setConnectionCount(data));

    socket.on('disconnect', () => setWSConnected(false));

    return () => {
      socket.off('connect');
      socket.off('message');
      socket.off('connectionCount');
      socket.off('disconnect');
    }
  });

  return (
    <>
      <Header wsConnected={wsConnected} connectionCount={connectionCount} />

      <ChatWindow wsConnected={wsConnected} messages={messages} messageInput={messageInput} setMessageInput={setMessageInput} />
    </>
  );
}

function Header(props: {
  wsConnected: boolean,
  connectionCount: number
}) {
  function toggleWS() {
    return socket.disconnected ? socket.connect() : socket.disconnect();
  }

  return <header>
    <button className={`connectButton ${props.wsConnected ? ' connected' : ''}`} onClick={toggleWS}>{props.wsConnected ? 'disconnect' : 'connect'}</button>

    <div className='connection-count'>Users: {props.connectionCount}</div>
  </header>;
}

function ChatWindow(props: {
  wsConnected: boolean;
  messages: MessageData[];
  messageInput: string;
  setMessageInput: Dispatch<SetStateAction<string>>
}) {
  return (
    <div className='chat-window'>
      <div className='messages'>
        {
          props.messages.map((message, index) => (
            <MessageItem key={index} author={message.author} text={message.text} own={message.author == socket.id} />
          ))
        }
      </div>

      {
        !props.wsConnected ?
          <div className='not-connected-message'>Not Connected.</div>
          : <MessageForm inputMessage={props.messageInput} setInputMessage={props.setMessageInput} />
      }
    </div>
  );
}

function MessageForm(props: {
  inputMessage: string;
  setInputMessage: Dispatch<SetStateAction<string>>;
}) {
  function sendMessage() {
    if (socket.id) {
      socket.emit('message', {
        author: socket.id,
        text: props.inputMessage,
      });

      props.setInputMessage('');
    }
  }

  return (
    <div className='message-form'>
      <input type="text" name="message" id="message-input"
        value={props.inputMessage}
        onChange={
          (e: React.ChangeEvent<HTMLInputElement>) => {
            props.setInputMessage(e.target.value)
          }
        } />

      <button type="button" className='send-message-button'
        onClick={sendMessage}
        disabled={props.inputMessage == ''}>Send</button>
    </div>
  )
}

function MessageItem(props: {
  author: string,
  text: string,
  own: boolean
}) {
  return (
    <div className={`message${props.own ? ' own' : ''}`}>
      <div className='author'>{props.author}</div>
      <div className='text'>{props.text}</div>
    </div>
  );
}

export default App;
