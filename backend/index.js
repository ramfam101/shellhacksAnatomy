const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const anatomyRoutes = require('./routes/anatomy');
app.use('/api/anatomy', anatomyRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Remove this line and set the environment variable in a .env file or your shell

const express = require('express');
const router = express.Router();
const axios = require('axios');

const openaiApiKey = process.env.OPENAI_API_KEY;

// Fetch questions from ChatGPT
router.get('/questions', async (req, res) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: [{ role: 'system', content: 'Generate a question.' }]
        }, {
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const generatedQuestion = response.data.choices[0].message.content;
        res.json({ question: generatedQuestion });
    } catch (error) {
        console.error('Error fetching question:', error.message);
        res.status(500).json({ error: 'Failed to generate question' });
    }
});

// Unlock question (this could interact with some other part of your system)
router.post('/unlock/:id', (req, res) => {
    const questionId = req.params.id;
    // Logic to unlock the question (if necessary)
    res.json({ success: true, message: `Question ${questionId} unlocked` });
});

module.exports = router;


