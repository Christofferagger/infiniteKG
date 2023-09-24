import { Request, Response, Router } from 'express';
import GetAllData from '../services/neo4jGetData';
import OpenAIKG from '../services/openAIKG';
import OpenAIChat from '../services/openAIChat';

const router = Router();

router.post('/query', async (req: Request, res: Response) => {
    const { queryPrompt, button } = req.body;
    console.log(queryPrompt);
    if (button === 'Build Graph') {
        await OpenAIKG(queryPrompt);
    }
    const data = await GetAllData();
    const chat = await OpenAIChat(queryPrompt, data);
    res.json({ message: {'data': data, 'chat': chat} });
});

export default router;