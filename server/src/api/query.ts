import { Request, Response, Router } from 'express';
import GetAllData from '../services/neo4jGetData';
import OpenAIKG from '../services/openAIKG';
import OpenAIChat from '../services/openAIChat';

const router = Router();

// to commit
router.post('/query', async (req: Request, res: Response) => {
    const { queryPrompt, button } = req.body;
    let newData = null;
    const chatAnswer = await OpenAIChat(queryPrompt);
    if (button === 'Graph') {
        newData = await OpenAIKG(queryPrompt, chatAnswer);
    }
    const data = await GetAllData();
    res.json({ message: { 'data': data, 'chat': chatAnswer, 'newData': newData } }); 
});

export default router;