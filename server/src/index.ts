import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
const port = 3001;

app.get('/api/data', (req: Request, res: Response) => {
    res.json({ message: 'Hello from the server!' });
});

app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
});