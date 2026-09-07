import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function Header(props: {
    wsConnected: boolean
}) {
    const [connectionCount, setConnectionCount] = useState<number>(0);

    useEffect(() => {
        socket.on('connectionCount', (data) => setConnectionCount(data));

        return () => {
            socket.off('connectionCount');
        }
    }, []);

    function toggleWS() {
        return socket.disconnected ? socket.connect() : socket.disconnect();
    }

    return <header>
        <button
            className={`connectButton ${props.wsConnected ? ' connected' : ''}`}
            onClick={toggleWS}>
            {props.wsConnected ? 'disconnect' : 'connect'}
        </button>

        <div
            className='connection-count'>
            Users: {connectionCount}
        </div>
    </header>;
}