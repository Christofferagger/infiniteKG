"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
let chatHistory = [];
function OpenAIChat(query, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = `You will generate a concise, dense and self-contained answer to this question: ${query} by following this method.
    Repeat these two steps two times.
    Step 1. Identify informative entities based on the nodes in this knowledge-graph ${data}, which you are missing from the previously generated answer.
    Step 2. Write a new denser answer to ${query}, which includes the previous and new entities. The answer length should be the same as before, but the content more informative.
    An entity is:
    Relevant: To answering the question: ${query}.
    Specific: Descriptive yet concise (5 words or fewer).
    Novel: Not in the previous answer.
    Faithful: Present in the knowledge-graph: ${data}.
    Guidelines:
    The summary should be as short as possible while still giving a comprehensive answer to the question.
    Make every word count, re-write the previous summary to improve flow and make space for additional entities.
    Make space with fusion compression and removal of uninformative phrases.
    The answers should become highly dense and concise yet self-contained e.g. easily understood without prior knowledge.
    You must at no point mention the knowledge graph in your answer, but you should be aware that the user should get a collective in-depth understanding by reading your answer and looking at the knowledge graph, therefore there should be synergy.
    Please structure your answer in multiple paragraphs, use **bold** to highlight key points, use bullet points (•) for unordered lists, and use numbered lists (1., 2., 3., etc.) for sequential or prioritized information where appropriate.`;
        let answer = '';
        try {
            const response = yield openai.chat.completions.create({
                model: "gpt-3.5-turbo-16k",
                messages: [
                    {
                        role: "system",
                        content: prompt
                    },
                    {
                        role: "user",
                        content: query
                    }
                ],
            });
            if (response.choices[0] && response.choices[0]["message"]["content"]) {
                answer = response.choices[0]["message"]["content"];
                answer = answer.replace(/•/g, '\n•');
                answer = answer.replace(/(\d+\.\s)/g, '\n$1');
                chatHistory.push({
                    query: query,
                    response: answer
                });
            }
            else {
                answer = "No response from OpenAI";
            }
        }
        catch (error) {
            console.error(error);
        }
        return chatHistory;
    });
}
;
exports.default = OpenAIChat;
