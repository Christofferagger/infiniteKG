import express, { Request, Response } from 'express';
import cors from 'cors';
import queryRouter from './api/query';

const app = express();
app.use(cors());
app.use(express.json());
const port = 3001;

app.use('/api', queryRouter);

app.get('/api/data', (req: Request, res: Response) => {
    res.json({ message: 'Hello from the server!' });
});

app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
});