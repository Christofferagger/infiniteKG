import express, { Request, Response } from 'express';
import cors from 'cors';
import queryRouter from './api/query';
import { setWebSocketServer } from './services/openAIChat';
import http from 'http';
import WebSocket from 'ws';

const app = express();
app.use(cors());
app.use(express.json());
const port = 3001;

app.use('/api', queryRouter);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

setWebSocketServer(wss);

app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
});