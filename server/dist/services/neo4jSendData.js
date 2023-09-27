"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const neo4j = __importStar(require("neo4j-driver"));
dotenv.config();
const username = process.env.NEO4J_USERNAME;
const password = process.env.NEO4J_PASSWORD;
const url = process.env.NEO4J_URL;
if (!username || !password || !url) {
    throw new Error('Environment variables NEO4J_USERNAME, NEO4J_PASSWORD, or NEO4J_URL are not set');
}
const driver = neo4j.driver(url, neo4j.auth.basic(username, password));
function ImportData(responseData) {
    return __awaiter(this, void 0, void 0, function* () {
        const session = driver.session();
        try {
            const data = JSON.parse(responseData);
            const nodes = data['nodes'];
            const edges = data['edges'];
            // import new nodes into neo4j
            yield session.run(`
            UNWIND $nodes AS node
            MERGE (n:Node {id:toLower(node.id)})
            SET n.type = node.type, n.label = node.label, n.color = node.color
        `, { nodes });
            // import new relationships into neo4j
            yield session.run(`
            UNWIND $rels AS rel
            MATCH (s:Node {id: toLower(rel.from)})
            MATCH (t:Node {id: toLower(rel.to)})
            MERGE (s)-[r:RELATIONSHIP {type:rel.relationship}]->(t)
            SET r.direction = rel.direction, r.color = rel.color
        `, { rels: edges });
        }
        catch (error) {
            console.error('Error when immporting data into Neo4j: ', error);
        }
        finally {
            session.close();
            console.log('neo4j database updated');
        }
    });
}
exports.default = ImportData;
