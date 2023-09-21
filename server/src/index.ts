import express, { Request, Response } from 'express';
import cors from 'cors';
import queryRouter from './api/query';

const app = express();
app.use(cors());
app.use(express.json());
const port = 3001;

app.use('/api', queryRouter);

app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
});