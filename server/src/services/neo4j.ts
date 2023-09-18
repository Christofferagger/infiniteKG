import * as dotenv from 'dotenv';
import * as neo4j from 'neo4j-driver';

dotenv.config();

const username = process.env.NEO4J_USERNAME;
const password = process.env.NEO4J_PASSWORD;
const url = process.env.NEO4J_URL;

if (!username || !password || !url) {
    throw new Error('Environment variables NEO4J_USERNAME, NEO4J_PASSWORD, or NEO4J_URL are not set');
}

const driver = neo4j.driver(url, neo4j.auth.basic(username, password));

async function ImportData(responseData: string) {
    const session = driver.session();

    try {
        const data = JSON.parse(responseData);
        const nodes = data['nodes'];
        const edges = data['edges'];

        // import new nodes into neo4j
        await session.run(`
            UNWIND $nodes AS node
            MERGE (n:Node {id:toLower(node.id)})
            SET n.type = node.type, n.label = node.label, n.color = node.color
        `, { nodes });

        // import new relationships into neo4j
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
        session.close();
        console.log('neo4j database updated');
    }
}

export default ImportData;