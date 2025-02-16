import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get('/', (req, res) => {
  res.send('Mock Speak Animator API Server');
});

import fs from 'fs';
import path from 'path';

// Ensure output directory exists
const outputDir = path.join(process.cwd(), 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

app.post('/api/mock', async (req, res) => {
  try {
    const { input } = req.body;
    const prompt = `Given this message, respond with a single sarcastic and mocking tone: ${input}\n\nProvide only ONE witty response that makes fun of the message. Keep it concise and sharp. Use Slang`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: prompt
      }],
      temperature: 0.8,
      max_tokens: 60,
      top_p: 0.95
    });

    const mockResponse = response.choices[0].message.content.trim();
    
    // Save response to a file with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = path.join(outputDir, `response-${timestamp}.txt`);
    fs.writeFileSync(filename, mockResponse);

    // Send response as JSON
    res.json({ response: mockResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});