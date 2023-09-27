import { Request, Response, Router } from 'express';
import GetAllData from '../services/neo4jGetData';
import OpenAIKG from '../services/openAIKG';
import OpenAIChat from '../services/openAIChat';

const router = Router();

router.post('/query', async (req: Request, res: Response) => {
    const { queryPrompt, button, existingGraph } = req.body;
    let newData = null;

    // Test OpenAIChat performance
    const startChat = Date.now();
    const chat = await OpenAIChat(queryPrompt);
    console.log('OpenAIChat Time:', Date.now() - startChat, 'ms');

    if (button === 'Graph') {
        // Test OpenAI KnowledgeGraph performance
        const startKG = Date.now();
        newData = await OpenAIKG(queryPrompt, chat.answer);
        console.log('OpenAIKG Time:', Date.now() - startKG, 'ms');
    }

    // Test Getting the data performance
    const startGetData = Date.now();
    const data = await GetAllData();
    console.log('GetAllData Time:', Date.now() - startGetData, 'ms');
    
    res.json({ message: { 'data': data, 'chat': chat.chat, 'newData': newData } }); 
});

export default router;