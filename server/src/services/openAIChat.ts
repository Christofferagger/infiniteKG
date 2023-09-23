import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

type ChatHistoryType = {
    query: string;
    response: string;
};

let chatHistory: ChatHistoryType[] = [];

async function OpenAIChat(query: string, data: any): Promise<ChatHistoryType[]> {
    
    const prompt = `Please make a comprehensive answer to this question: ${query}. Use the following knowledge-graph to direct your answer: ${data}. You must at no point mention the knowledge graph in your answer. The user should get a collective in depth answer when looking at the provided knowledge graph and reading your answer. Please structure your answer in multiple paragraphs, use **bold** to highlight key points, use bullet points (•) for unordered lists, and use numbered lists (1., 2., 3., etc.) for sequential or prioritized information where appropriate.`;

    let answer = '';
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
        });

        if (response.choices[0] && response.choices[0]["message"]["content"]) {
            answer = response.choices[0]["message"]["content"];
            chatHistory.push({
                query: query,
                response: answer
            })
        } else {
            answer = "No response from OpenAI";
        }
        
    } catch (error) {
        console.error(error);
    }
    
    return chatHistory;
};

export default OpenAIChat;