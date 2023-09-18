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
const neo4j_1 = __importDefault(require("./neo4j"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
function OpenAICall(queryPrompt) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = queryPrompt;
        let completion;
        let responseData;
        try {
            completion = yield openai.chat.completions.create({
                model: "gpt-3.5-turbo-16k",
                messages: [
                    {
                        role: "user",
                        content: `Help me understand following by describing as a detailed knowledge graph: ${query}`
                    }
                ],
                functions: [
                    {
                        name: "knowledge_graph",
                        description: "Generate a knowledge graph with entities and relationships. Use the colors to help differentiate between different node or edge types/categories. Always provide light pastel colors that work well with black font.",
                        parameters: {
                            type: "object",
                            properties: {
                                metadata: {
                                    type: "object",
                                    properties: {
                                        createdDate: { type: "string" },
                                        lastUpdated: { type: "string" },
                                        description: { type: "string" }
                                    }
                                },
                                nodes: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            label: { type: "string" },
                                            type: { type: "string" },
                                            color: { type: "string" },
                                            properties: {
                                                type: "object",
                                                description: "Additional attributes for the node"
                                            }
                                        },
                                        required: ["id", "label", "type", "color"]
                                    }
                                },
                                edges: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            from: { type: "string" },
                                            to: { type: "string" },
                                            relationship: { type: "string" },
                                            direction: { type: "string" },
                                            color: { type: "string" },
                                            properties: {
                                                type: "object",
                                                description: "Additional attributes for the edge"
                                            }
                                        },
                                        required: ["from", "to", "relationship", "color"]
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
            responseData = completion.choices[0]["message"]["function_call"]["arguments"];
            console.log(responseData);
            try {
                yield (0, neo4j_1.default)(responseData);
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
exports.default = OpenAICall;
