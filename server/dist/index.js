"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const query_1 = __importDefault(require("./api/query"));
const openAIChat_1 = require("./services/openAIChat");
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = 3001;
app.use('/api', query_1.default);
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server });
(0, openAIChat_1.setWebSocketServer)(wss);
app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
});
