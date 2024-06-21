import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const PORT = 3000;
const dbFile = '../db.json'; // Adjust path if necessary

app.use(bodyParser.json());

// Initialize db.json if it does not exist
if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify({ submissions: [] }));
}

// /ping endpoint
app.get('/ping', (req, res) => {
    res.send(true);
});

// /submit endpoint
app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    const db = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
    db.submissions.push({ name, email, phone, github_link, stopwatch_time });
    fs.writeFileSync(dbFile, JSON.stringify(db));
    res.send({ success: true });
});

// /read endpoint
app.get('/read', (req, res) => {
    const index = parseInt(req.query.index as string, 10);
    const db = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
    if (index >= 0 && index < db.submissions.length) {
        res.send(db.submissions[index]);
    } else {
        res.status(404).send({ error: 'Submission not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

