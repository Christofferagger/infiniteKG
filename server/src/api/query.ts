import { Request, Response, Router } from 'express';
import GetAllData from '../services/neo4jGetData';
import OpenAIKG from '../services/openAIKG';
import OpenAIChat from '../services/openAIChat';

const router = Router();

// to commit
router.post('/query', async (req: Request, res: Response) => {
    const { queryPrompt, button, existingGraph } = req.body;
    let newData = null;
    const chat = await OpenAIChat(queryPrompt);
    if (button === 'Graph') {
        newData = await OpenAIKG(queryPrompt, chat.answer);
    }
    const data = await GetAllData();
    res.json({ message: { 'data': data, 'chat': chat.chat, 'newData': newData } }); 
});

export default router;