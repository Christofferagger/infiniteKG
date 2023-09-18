import { Request, Response, Router } from 'express';
import OpenAICall from '../services/openai';
import GetAllData from '../services/neo4jGetData';

const router = Router();

router.post('/query', async (req: Request, res: Response) => {
    const queryPrompt = req.body.query;
    console.log(queryPrompt);
    await OpenAICall(queryPrompt);
    const data = await GetAllData();
    res.json({ message: data });
});

export default router;