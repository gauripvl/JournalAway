const express = require('express');
const cors = require('cors');
const { Octokit } = require('@octokit/core');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/entries', async (req, res) => {
    const { entry } = req.body;
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    try {
        const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: 'gauripvl',
            repo: 'JournalAway',
            path: 'Journal.md',
            message: 'New journal entry',
            content: Buffer.from(entry).toString('base64'),
            sha: await getSha(octokit, 'gauripvl', 'JournalAway', 'Journal.md')
        });
        res.json({ message: 'Entry added successfully!', data: response.data });
    } catch (error) {
        console.error('Error saving entry:', error);
        res.status(500).json({ message: 'Failed to add entry', error });
    }
});

const getSha = async (octokit, owner, repo, path) => {
    try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner,
            repo,
            path
        });
        return response.data.sha;
    } catch (error) {
        return null;  // Return null if the file does not exist yet
    }
};

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});