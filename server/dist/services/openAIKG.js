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
const neo4jSendData_1 = __importDefault(require("./neo4jSendData"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const typeColorMapping = ['#CCFFDA', '#E4CCFF', '#FECCFF', '#CCD1FF', '#CCE0FF', '#FFE8CC', '#FBFFCC', '#FFCFCC', '#FFCCDE'];
const typeToColor = new Map();
let colorIndex = 0;
function OpenAIKG(queryPrompt, answer) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = queryPrompt;
        let completion;
        let responseData = { nodes: [], edges: [] };
        try {
            completion = yield openai.chat.completions.create({
                model: "gpt-3.5-turbo-16k",
                messages: [
                    {
                        role: "user",
                        content: `Given the question: ${query}, and the answer: ${answer}, please provide a concise knowledge graph. Highlight the main points, with a maximum of 8 nodes and 10 edges. Keep edge descriptions simple, using a maximum of 4 words in the 'type' parameter. The 'id' of each node should be equivalent to its 'label'.`
                    }
                ],
                functions: [
                    {
                        name: "knowledge_graph",
                        description: "Generate a concise knowledge graph with entities and relationships. The 'type' description for edges should be brief, using no more than 4 words. The 'id' for each node should match its 'label'.",
                        parameters: {
                            type: "object",
                            properties: {
                                nodes: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "string",
                                                description: "Should be equivalent to the label."
                                            },
                                            label: { type: "string" },
                                            type: { type: "string" }
                                        },
                                        required: ["id", "label", "type"]
                                    }
                                },
                                edges: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            from: { type: "string" },
                                            to: { type: "string" },
                                            type: {
                                                type: "string",
                                                maxLength: 4,
                                                description: "Brief description using up to 4 words."
                                            },
                                            relationship: { type: "string" },
                                            direction: { type: "string" }
                                        },
                                        required: ["from", "to", "type", "direction"]
                                    }
                                }
                            },
                            required: ["nodes", "edges"]
                        }
                    }
                ],
                function_call: { name: "knowledge_graph" }
            });
        }
        catch (error) {
            console.error("Error generating knowledge graph:", error);
            throw new Error("Error generating knowledge graph.");
        }
        if (completion && completion.choices && completion.choices[0] && completion.choices[0]["message"] && completion.choices[0]["message"]["function_call"]) {
            console.log(completion.choices[0]["message"]["function_call"]["arguments"]);
            responseData = JSON.parse(completion.choices[0]["message"]["function_call"]["arguments"]);
            responseData.nodes.forEach(node => {
                if (!typeToColor.has(node.type)) {
                    typeToColor.set(node.type, typeColorMapping[colorIndex % typeColorMapping.length]);
                    colorIndex++;
                }
                node.color = typeToColor.get(node.type);
            });
            try {
                yield (0, neo4jSendData_1.default)(JSON.stringify(responseData));
            }
            catch (error) {
                console.error("Error importing data into Neo4j: ", error);
                throw new Error("Error importing data into Neo4j.");
            }
        }
        return responseData;
    });
}
;
exports.default = OpenAIKG;
