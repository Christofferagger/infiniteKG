import * as dotenv from 'dotenv';
import * as neo4j from 'neo4j-driver';

// Load environment variables
dotenv.config();

// Extract Neo4j parameters from environment variables
const username = process.env.NEO4J_USERNAME;
const password = process.env.NEO4J_PASSWORD;
const url = process.env.NEO4J_URL;

// Check if Neo4j parameters are set
if (!username || !password || !url) {
    throw new Error('Environment variables NEO4J_USERNAME, NEO4J_PASSWORD, or NEO4J_URL are not set');
}

// Initialize Neo4j driver
const driver = neo4j.driver(url, neo4j.auth.basic(username, password));

// Function to get all nodes and edges from Neo4j
async function GetAllData() {
    const session = driver.session();

    // create elements array for graph visualization data
    interface Element {
        group: string;
        data: {
            id: any;
            label: any;
            color: any;
            type: any;
            source?: any;
            target?: any;
            relationship?: any;
            [key: string]: any; 
        };
    }
    let elements: Element[] = [];

    try {
        // Query to get all nodes
        const nodesQuery = 'MATCH (n) RETURN n';
        const nodesResult = await session.run(nodesQuery);
        const nodes = nodesResult.records.map(record => record.get('n').properties);

        // Query to get all edges
        const edgesQuery = 'MATCH (n)-[r]->(m) RETURN r, n, m';
        const edgesResult = await session.run(edgesQuery);
        const edges = edgesResult.records.map(record => {
            const relationship = record.get('r');
            const fromNode = record.get('n');
            const toNode = record.get('m');

            return {
                from: fromNode.properties.id,
                to: toNode.properties.id,
                relationship: relationship.type,
                properties: relationship.properties
            };
        });

        // Formats nodes to fit in elements
        nodes.forEach(node => {
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
        })
        // Formats edges to fit in elements
        edges.forEach(edge => {
            let obj = {
                group: 'edges',
                data: {
                    source: edge.from,
                    target: edge.to,
                    relationship: edge.relationship,
                    ...edge.properties
                }
            };
            elements.push(obj)
        })

        return elements;


    } catch (error) {
        console.error('Error when getting data from Neo4j: ', error);
    } finally {
        // Close the session
        session.close();
    }
};

export default GetAllData;
