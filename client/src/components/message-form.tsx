import { useState } from "react";
import { socket } from "../socket";

export default function MessageForm() {
    const [messageInput, setMessageInput] = useState<string>("");

    function sendMessage() {
        if (socket.id) {
            socket.emit('message', {
                author: socket.id,
                text: messageInput,
            });

            setMessageInput('');
        }
    }

    return (
        <div className='message-form'>
            <input type="text" name="message" id="message-input"
                value={messageInput}
                onChange={
                    (e: React.ChangeEvent<HTMLInputElement>) => {
                        setMessageInput(e.target.value)
                    }
                } />

            <button type="button" className='send-message-button'
                onClick={sendMessage}
                disabled={messageInput == ''}>Send</button>
        </div>
    )
}