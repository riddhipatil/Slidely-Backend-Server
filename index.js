"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const PORT = 3000;
const dbFile = '../db.json'; // Adjust path if necessary
app.use(body_parser_1.default.json());
// Initialize db.json if it does not exist
if (!fs_1.default.existsSync(dbFile)) {
    fs_1.default.writeFileSync(dbFile, JSON.stringify({ submissions: [] }));
}
// /ping endpoint
app.get('/ping', (req, res) => {
    res.send(true);
});
// /submit endpoint
app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    const db = JSON.parse(fs_1.default.readFileSync(dbFile, 'utf-8'));
    db.submissions.push({ name, email, phone, github_link, stopwatch_time });
    fs_1.default.writeFileSync(dbFile, JSON.stringify(db));
    res.send({ success: true });
});
// /read endpoint
app.get('/read', (req, res) => {
    const index = parseInt(req.query.index, 10);
    const db = JSON.parse(fs_1.default.readFileSync(dbFile, 'utf-8'));
    if (index >= 0 && index < db.submissions.length) {
        res.send(db.submissions[index]);
    }
    else {
        res.status(404).send({ error: 'Submission not found' });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
