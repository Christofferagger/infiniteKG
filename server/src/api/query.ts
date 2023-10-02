import { Request, Response, Router } from 'express';
import GetAllData from '../services/neo4jGetData';
import OpenAIKG from '../services/openAIKG';
import OpenAIChat from '../services/openAIChat';

const router = Router();

// POST route for '/query'
router.post('/query', async (req: Request, res: Response) => {
    const { queryPrompt, button } = req.body;
    let newData = null;

    // chat answer from OpenAIChat
    const chatAnswer = await OpenAIChat(queryPrompt);

    // If button is 'Graph', get new data from OpenAIKG
    if (button === 'Graph') {
        newData = await OpenAIKG(queryPrompt, chatAnswer);
    }
    // Get all data from GetAllData
    const data = await GetAllData();

    // Send response with the collected data
    res.json({ message: { 'data': data, 'chat': chatAnswer, 'newData': newData } }); 
});

export default router;