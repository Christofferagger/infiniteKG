"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const query_1 = __importDefault(require("./api/query"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
// Initialize express app
const app = (0, express_1.default)();
// Use cors and json middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// port server runs on
const port = 3001;
// Use queryRouter for /api routes
app.use('/api', query_1.default);
const httpServer = http_1.default.createServer(app);
// Initialize socket.io server with cors options
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
exports.io = io;
// Start the server
httpServer.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
});
