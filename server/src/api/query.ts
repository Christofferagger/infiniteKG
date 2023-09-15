import { Request, Response, Router } from 'express';
import OpenAICall from '../services/openai';

const router = Router();

router.post('/query', async (req: Request, res: Response) => {
    const queryPrompt = req.body.query;
    console.log(queryPrompt);
    await OpenAICall(queryPrompt);
    res.json({ message: 'Got POST' });
});

export default router;