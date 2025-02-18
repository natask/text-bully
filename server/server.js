import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import Replicate from "replicate";
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import { serverStreamToWav } from './utils/serverStreamToWav.js';
import { mergeVideoWithAudio } from './utils/mergeVideoAudio.js';

dotenv.config();

// Global variables for server state
const STATE = {
  timestamp: null,
  message: null,
  filename: null
};
function createFileName(){
  return `${STATE.timestamp}_${STATE.message.replace(/[\s]/g, '_').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '')}`;
}
// Global paths
const PATHS = {
  root: "server",
  output: path.join("server", 'output')
};

const app = express();
// Configure CORS with specific options

app.use(cors());

// Handle preflight requests explicitly
app.options('*', cors());

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Ensure output directory exists
if (!fs.existsSync(PATHS.output)) {
  fs.mkdirSync(PATHS.output, { recursive: true });
}

// Middleware to set state
app.use((req, res, next) => {
  STATE.timestamp = STATE.timestamp || req.body.timestamp || new Date().toISOString().replace(/[:.]/g, '-');
  STATE.message = STATE.message || (req.body.message || req.body.input);
  next();
});

app.get('/', (req, res) => {
  res.send('Mock Speak Animator API Server');
});

async function generateMockingResponse(req, res) {
  try {
    const { input } = req.body;
    const prompt = `Given this message, respond with a single sarcastic and mocking tone: ${input}\n\nProvide only ONE witty response that makes fun of the message. Keep it concise and sharp. Use Slang and be nonchalant.`;

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
    
    // Save response with standardized filename
    const filename = path.join(PATHS.output, `${createFileName()}.txt`);
    fs.writeFileSync(filename, mockResponse);

    res.json({ response: mockResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
}

app.post('/api/mock', generateMockingResponse);

app.post('/api/audio', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message format. Expected string.' });
    }
    const input = {
      gen_text: message,
      ref_text: "you look fruity",
      ref_audio: "https://drive.google.com/uc?export=download&id=1pOvnyq4HcYLbVuHwLpnIjEFIP5wvM8NF"
    };

    const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY });

    const output = await replicate.run(
      "x-lance/f5-tts:87faf6dd7a692dd82043f662e76369cab126a2cf1937e25a9d41e0b834fd230e",
      { input }
    );
    // Convert the audio stream to WAV with standardized filename
    const wavOutputPath = path.join(PATHS.output, `${createFileName()}.wav`);
    await fsPromises.writeFile(wavOutputPath, output);
    console.log('Audio file saved at:', wavOutputPath);

    res.json({ response: wavOutputPath });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Serve static files from the output directory
app.use('/videos', express.static(path.join(process.cwd(), PATHS.output)));

app.post('/api/video', async (req, res) => {
  try {
    const { audioFilePath } = req.body;
    // Generate video with standardized filename
    const videoOutputPath = path.join(PATHS.output, `${createFileName()}.mp4`);
    await mergeVideoWithAudio(audioFilePath, path.join(PATHS.root, 'utils', 'final.mp4'), videoOutputPath);
    
    // Return the URL to access the video
    const videoUrl = `/videos/${path.basename(videoOutputPath)}`;
    res.json({ videoUrl });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});