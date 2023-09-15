"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/query', (req, res) => {
    console.log(req.body);
    res.json({ message: 'Got POST' });
});
exports.default = router;
