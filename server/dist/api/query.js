"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const neo4jGetData_1 = __importDefault(require("../services/neo4jGetData"));
const openAIKG_1 = __importDefault(require("../services/openAIKG"));
const openAIChat_1 = __importDefault(require("../services/openAIChat"));
const similaritySearch_1 = __importDefault(require("../services/similaritySearch"));
const router = (0, express_1.Router)();
// to commit
router.post('/query', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { queryPrompt, button, existingGraph } = req.body;
    console.log(queryPrompt);
    const chat = yield (0, openAIChat_1.default)(queryPrompt);
    if (button === 'Graph') {
        yield (0, similaritySearch_1.default)(chat.answer, existingGraph);
        yield (0, openAIKG_1.default)(queryPrompt, chat.answer);
    }
    const data = yield (0, neo4jGetData_1.default)();
    res.json({ message: { 'data': data, 'chat': chat.chat } });
}));
exports.default = router;
