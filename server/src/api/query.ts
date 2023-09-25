import { Request, Response, Router } from 'express';
import GetAllData from '../services/neo4jGetData';
import OpenAIKG from '../services/openAIKG';
import OpenAIChat from '../services/openAIChat';
import SimilaritySearch from '../services/similaritySearch';

const router = Router();

// to commit
router.post('/query', async (req: Request, res: Response) => {
    const { queryPrompt, button, existingGraph } = req.body;
    console.log(queryPrompt);
    const chat = await OpenAIChat(queryPrompt);
    if (button === 'Graph') {
        await SimilaritySearch(chat.answer, existingGraph);
        await OpenAIKG(queryPrompt, chat.answer);
    }
    const data = await GetAllData();
    res.json({ message: { 'data': data, 'chat': chat.chat} }); 
});

export default router;