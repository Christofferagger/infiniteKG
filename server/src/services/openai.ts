import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import ImportData from './neo4jSendData';

dotenv.config();


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function OpenAICall(queryPrompt: string): Promise<any> {
    const query = queryPrompt;
    let completion;
    let responseData;

    try {
        completion = await openai.chat.completions.create({
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

    } catch (error) {
        console.error("Error generating knowledge graph:", error);
        throw new Error("Error generating knowledge graph."); 
    }

    if (completion && completion.choices && completion.choices[0] && completion.choices[0]["message"] && completion.choices[0]["message"]["function_call"]) {
        responseData = completion.choices[0]["message"]["function_call"]["arguments"];

        try {
            await ImportData(responseData);
        } catch (error) {
            console.error("Error importing data into Neo4j: ", error);
            throw new Error("Error importing data into Neo4j.");
        }
    }

    return responseData;
};


export default OpenAICall;

