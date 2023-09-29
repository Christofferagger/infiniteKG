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

async function OpenAIChat(query: string): Promise<string> {
    
    const prompt =
    `You will generate a concise, dense and self-contained answer to this question: ${query} by following this method.
    Repeat these two steps two times.
    Step 1. Identify informative entities which are key to answering the question, and are missing from the previously generated answer.
    Step 2. Write a new denser answer to ${query}, which includes the previous and new entities. The answer length should be the same as before, but the content more informative.
    An entity is:
    Relevant: To answering the question: ${query}.
    Specific: Descriptive yet concise (5 words or fewer).
    Novel: Not in the previous answer.
    Guidelines:
    The answer should be as short as possible while still giving a comprehensive answer to the question.
    Make every word count, write the answer to improve flow and make space for additional entities.
    Make space with fusion compression and removal of uninformative phrases.
    The answer should become highly dense and concise yet self-contained e.g. easily understood without prior knowledge.
    You must at no point mention entities, steps or the method you have used to get the perfect answer.
    Please structure your answer in multiple paragraphs, use **bold** to highlight key points and entities, use bullet points (*) for unordered lists, and use numbered lists (1., 2., 3., etc.) for sequential or prioritized information where appropriate.`;

    let answer = '';
    try {
        const messages: { role: "system" | "user" | "assistant", content: string }[] = [
            {
                role: "system",
                content: prompt
            },
            ...chatHistory.map(chat => [
                { role: "user" as "user", content: chat.query },
                { role: "assistant" as "assistant", content: chat.response }
            ]).flat(),
            {
                role: "user",
                content: query
            }
        ];
        
        const stream = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            stream: true,
        });

        for await (const part of stream) {
            if (part.choices[0] && part.choices[0].delta) {
                let token = part.choices[0].delta.content || '';
                token = token.replace(/•/g, '\n•');
                token = token.replace(/(\d+\.\s)/g, '\n$1');
                answer += token;
            } else {
                answer = "No response from OpenAI";
            }
        };

        chatHistory.push({
            query: query,
            response: answer
        })
        
    } catch (error) {
        console.error(error);
    }
    
    return answer;
};

export default OpenAIChat;

