
import { useEffect, useState } from 'react';
import { socket } from '../socket';
import type { MessageData } from '../types/socket';
import MessageItem from './messageItem';
import MessageForm from './message-form';

export default function ChatWindow(props: {
    wsConnected: boolean;
}) {
    const [messages, setMessages] = useState<MessageData[]>([]);

    useEffect(() => {
        socket.on('message', (data) => setMessages((prev) => [...prev, data]));

        return () => {
            socket.off('message');
        };
    }, []);

    return (
        <div className='chat-window'>
            <div className='messages'>
                {
                    messages.map((message, index) => (
                        <MessageItem key={index} author={message.author} text={message.text} own={message.author == socket.id} />
                    ))
                }
            </div>

            {
                !props.wsConnected ?
                    <div className='not-connected-message'>Not Connected.</div>
                    : <MessageForm />
            }
        </div>
    );
}