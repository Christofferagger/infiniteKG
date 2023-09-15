"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const port = 3001;
app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from the server!' });
});
app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
});
