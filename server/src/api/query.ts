import { Request, Response, Router } from 'express';
import GetAllData from '../services/neo4jGetData';
import OpenAIKG from '../services/openAIKG';
import OpenAIChat from '../services/openAIChat';

const router = Router();

router.post('/query', async (req: Request, res: Response) => {
    const { queryPrompt, button } = req.body;
    console.log(queryPrompt);
    const chat = await OpenAIChat(queryPrompt);
    if (button === 'Build Graph') {
        await OpenAIKG(queryPrompt, chat.answer);
    }
    const data = await GetAllData();
    res.json({ message: {'data': data, 'chat': chat.chat} });
});

export default router;