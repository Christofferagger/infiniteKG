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
        let elements = [];
        const prompt = `Given the question: ${query}, and the answer: ${answer}, provide a concise knowledge graph. Highlight main points. Max 8 nodes and 10 edges. Keep edge descriptions simple. The 'id' of each node should be equivalent to its 'label'.`;
        try {
            const startAPICall = Date.now();
            completion = yield openai.chat.completions.create({
                model: "gpt-3.5-turbo-16k",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                functions: [
                    {
                        name: "knowledge_graph",
                        description: "Generate a concise knowledge graph.",
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
                                                description: "Equivalent to the label."
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
                                                description: "Brief description."
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
            console.log('APICall Time:', Date.now() - startAPICall, 'ms');
        }
        catch (error) {
            console.error("Error generating knowledge graph:", error);
            throw new Error("Error generating knowledge graph.");
        }
        if (completion && completion.choices && completion.choices[0] && completion.choices[0]["message"] && completion.choices[0]["message"]["function_call"]) {
            responseData = JSON.parse(completion.choices[0]["message"]["function_call"]["arguments"]);
            yield Promise.all([
                processNodes(responseData.nodes),
                processEdges(responseData.edges)
            ]);
            function processNodes(nodes) {
                return __awaiter(this, void 0, void 0, function* () {
                    responseData.nodes.forEach(node => {
                        if (!typeToColor.has(node.type)) {
                            typeToColor.set(node.type, typeColorMapping[colorIndex % typeColorMapping.length]);
                            colorIndex++;
                        }
                        node.color = typeToColor.get(node.type);
                        node.id = node.id.toLowerCase();
                    });
                });
            }
            ;
            function processEdges(edges) {
                return __awaiter(this, void 0, void 0, function* () {
                    responseData.edges.forEach(edge => {
                        edge.from = edge.from.toLowerCase();
                        edge.to = edge.to.toLowerCase();
                    });
                });
            }
            ;
            try {
                // Test the performance of ImportData
                const startImportData = Date.now();
                yield (0, neo4jSendData_1.default)(JSON.stringify(responseData));
                console.log('ImportData Time:', Date.now() - startImportData, 'ms');
            }
            catch (error) {
                console.error("Error importing data into Neo4j: ", error);
                throw new Error("Error importing data into Neo4j.");
            }
            ;
            responseData.nodes.forEach(node => {
                let obj = {
                    group: 'nodes',
                    data: {
                        id: node.id,
                        label: node.label,
                        color: node.color,
                        type: node.type
                    }
                };
                elements.push(obj);
            });
            responseData.edges.forEach(edge => {
                let obj = {
                    group: 'edges',
                    data: Object.assign({ source: edge.from, target: edge.to, relationship: edge.relationship, type: edge.type, direction: edge.direction }, edge.properties)
                };
                elements.push(obj);
            });
        }
        return elements;
    });
}
;
exports.default = OpenAIKG;
