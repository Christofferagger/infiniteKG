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

// Function to import generated data into Neo4j
async function ImportData(responseData: string) {
    const session = driver.session();

    try {
        // Parse the response data
        const data = JSON.parse(responseData);
        const nodes = data['nodes'];
        const edges = data['edges'];

        // import new nodes into neo4j
        await session.run(`
            UNWIND $nodes AS node
            MERGE (n:Node {id:toLower(node.id)})
            SET n.type = node.type, n.label = node.label, n.color = node.color
        `, { nodes });

        // import new edges into neo4j
        await session.run(`
            UNWIND $rels AS rel
            MATCH (s:Node {id: toLower(rel.from)})
            MATCH (t:Node {id: toLower(rel.to)})
            MERGE (s)-[r:RELATIONSHIP {type:rel.relationship}]->(t)
            SET r.direction = rel.direction, r.color = rel.color
        `, { rels: edges });
    } catch (error) {
        console.error('Error when immporting data into Neo4j: ', error);
    } finally {
        // Close the session
        session.close();
        console.log('neo4j database updated');
    }
}

export default ImportData;