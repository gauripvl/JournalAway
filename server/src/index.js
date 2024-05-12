import express from 'express';
import cors from 'cors';
import { Octokit } from '@octokit/core';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

app.post('/entries', async (req, res) => {
    const { entry } = req.body;
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}`;
    const filename = `journal_${formattedDate}_${formattedTime}.md`;
    const content = `# Journal Entry: ${formattedDate} ${formattedTime}\n\n${entry}\n`;

    try {
        // Create a new journal file on GitHub with the current date and time in its name
        const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: 'gauripvl',
            repo: 'JournalAway',
            path: filename,
            message: `Create new journal entry file: ${filename}`,
            content: Buffer.from(content).toString('base64')
        });
        res.json({ message: 'Journal entry added successfully!', data: response.data });
    } catch (error) {
        console.error('Error saving entry:', error);
        res.status(500).json({ message: 'Failed to add entry', error });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
