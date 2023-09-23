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
        const prompt = `Please make a comprehensive answer to this question: ${query}. Use the following knowledge-graph to direct your answer: ${data}. You must at no point mention the knowledge graph in your answer. The user should get a collective in depth answer when looking at the provided knowledge graph and reading your answer. Please structure your answer in multiple paragraphs, use **bold** to highlight key points, use bullet points (•) for unordered lists, and use numbered lists (1., 2., 3., etc.) for sequential or prioritized information where appropriate.`;
        let answer = '';
        try {
            const response = yield openai.chat.completions.create({
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
