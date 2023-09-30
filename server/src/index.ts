import express, { Request, Response } from 'express';
import cors from 'cors';
import queryRouter from './api/query';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
app.use(cors());
app.use(express.json());
const port = 3001;

app.use('/api', queryRouter);

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

export { io };

httpServer.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
});
