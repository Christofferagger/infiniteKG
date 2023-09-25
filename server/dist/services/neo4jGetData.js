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
function GetAllData() {
    return __awaiter(this, void 0, void 0, function* () {
        const session = driver.session();
        let elements = [];
        try {
            // Query to get all nodes
            const nodesQuery = 'MATCH (n) RETURN n';
            const nodesResult = yield session.run(nodesQuery);
            const nodes = nodesResult.records.map(record => record.get('n').properties);
            // Query to get all relationships
            const edgesQuery = 'MATCH (n)-[r]->(m) RETURN r, n, m';
            const edgesResult = yield session.run(edgesQuery);
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
            });
            // Formats edges to fit in elements
            edges.forEach(edge => {
                let obj = {
                    group: 'edges',
                    data: Object.assign({ source: edge.from, target: edge.to, relationship: edge.relationship }, edge.properties)
                };
                elements.push(obj);
            });
            return elements;
        }
        catch (error) {
            console.error('Error when getting data from Neo4j: ', error);
        }
        finally {
            session.close();
        }
    });
}
;
exports.default = GetAllData;
