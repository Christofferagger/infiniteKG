import express, { Request, Response } from 'express';
import cors from 'cors';
import queryRouter from './api/query';
import { Server } from 'socket.io';
import http from 'http';

// Initialize express app
const app = express();

// Use cors and json middleware
app.use(cors());
app.use(express.json());

// port server runs on
const port = 3001;

// Use queryRouter for /api routes
app.use('/api', queryRouter);

const httpServer = http.createServer(app);

// Initialize socket.io server with cors options
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

export { io };

// Start the server
httpServer.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
});
