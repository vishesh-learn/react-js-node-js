import './App.scss';
import { useEffect, useState } from 'react';
import Header from './components/header';
import { socket } from './socket';
import ChatWindow from './components/chat-window';

export default function App() {
  const [wsConnected, setWSConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on('connect', () => setWSConnected(true));

    socket.on('disconnect', () => setWSConnected(false));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    }
  }, []);

  return (
    <>
      <Header wsConnected={wsConnected} />

      <ChatWindow wsConnected={wsConnected} />
    </>
  );
}
