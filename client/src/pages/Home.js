// src/pages/Home.js
import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [entry, setEntry] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/entries', { entry });
            console.log(response.data); // Success message or response
        } catch (error) {
            console.error('Failed to send entry:', error);
        }
    };

    return (
        <div>
            <h1>Journal Entry</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    placeholder="Write your journal entry here..."
                />
                <button type="submit">Submit Entry</button>
            </form>
        </div>
    );
};

export default Home;
