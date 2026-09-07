import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Private-Network', 'true');

    next();
});

app.get('/', (req, res) => {
    res.send('hello world');
});

const httpServer = createServer(app);

console.log('allowing', process.env.CORS?.split(','));

interface MessageData {
    author: string;
    text: string;
}

interface ServerToClientEvents {
    message: (data: MessageData) => void;
    connectionCount: (data: number) => void;
}

const io: Server<ServerToClientEvents> = new Server(httpServer, {
    cors: {
        origin: process.env.CORS?.split(',')
    }
});

httpServer.listen(8000, () => {
    console.log('server listening at...', 8000);
});

io.on('connection', (socket) => {
    io.emit('connectionCount', io.engine.clientsCount);

    console.log('client connected:', socket.id);

    socket.on('message', (data) => {
        console.log('message from client', data);

        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        io.emit('connectionCount', io.engine.clientsCount);
    });
});