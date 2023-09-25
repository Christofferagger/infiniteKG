import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import ImportData from './neo4jSendData';

dotenv.config();


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const typeColorMapping = ['#CCFFDA', '#E4CCFF', '#FECCFF', '#CCD1FF', '#CCE0FF', '#FFE8CC', '#FBFFCC', '#FFCFCC', '#FFCCDE'];
const typeToColor = new Map();  
let colorIndex = 0;

interface Node {
    id: string;
    label: string;
    type: string;
    properties: object;
    color?: string;
}

interface ResponseData {
    nodes: Node[];
    edges: any[]; 
}

async function OpenAIKG(queryPrompt: string, answer: string): Promise<any> {
    const query = queryPrompt;
    let completion;
    let responseData: ResponseData = { nodes: [], edges: [] };

    try {
        completion = await openai.chat.completions.create({
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
                                            maxLength: 4, // Setting a maximum length for 'type'
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

    } catch (error) {
        console.error("Error generating knowledge graph:", error);
        throw new Error("Error generating knowledge graph."); 
    }

    if (completion && completion.choices && completion.choices[0] && completion.choices[0]["message"] && completion.choices[0]["message"]["function_call"]) {
        console.log(completion.choices[0]["message"]["function_call"]["arguments"]);
        responseData = JSON.parse(completion.choices[0]["message"]["function_call"]["arguments"]) as ResponseData;

        responseData.nodes.forEach(node => {
            if (!typeToColor.has(node.type)) {
                typeToColor.set(node.type, typeColorMapping[colorIndex % typeColorMapping.length]);
                colorIndex++;
            }
            node.color = typeToColor.get(node.type);
        });

        try {
            await ImportData(JSON.stringify(responseData));
        } catch (error) {
            console.error("Error importing data into Neo4j: ", error);
            throw new Error("Error importing data into Neo4j.");
        }
    }

    return responseData;
};


export default OpenAIKG;

