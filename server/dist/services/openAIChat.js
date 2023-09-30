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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("../index");
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
let chatHistory = [];
function OpenAIChat(query) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = `You will generate a concise, dense and self-contained answer to this question: ${query} by following this method.
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
            const messages = [
                {
                    role: "system",
                    content: prompt
                },
                ...chatHistory.map(chat => [
                    { role: "user", content: chat.query },
                    { role: "assistant", content: chat.response }
                ]).flat(),
                {
                    role: "user",
                    content: query
                }
            ];
            const stream = yield openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messages,
                stream: true,
            });
            try {
                for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a; _d = true) {
                    _c = stream_1_1.value;
                    _d = false;
                    const part = _c;
                    if (part.choices[0] && part.choices[0].delta) {
                        let token = part.choices[0].delta.content || '';
                        token = token.replace(/•/g, '\n•');
                        token = token.replace(/(\d+\.\s)/g, '\n$1');
                        answer += token;
                        index_1.io.emit('token', token);
                    }
                    else {
                        answer = "No response from OpenAI";
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            ;
            chatHistory.push({
                query: query,
                response: answer
            });
        }
        catch (error) {
            console.error(error);
        }
        return answer;
    });
}
;
exports.default = OpenAIChat;
