import axios from 'axios';
import Replicate from "replicate";
import { writeFile, readFile } from "node:fs/promises";

const API_BASE_URL = 'https://stormy-eyrie-50634-676b2fbbda97.herokuapp.com/';

export async function generateMockingResponse(input: string): Promise<string> {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/mock`, { input });
    return response.data.response;
  } catch (error) {
    console.error('Error generating mocking response:', error);
    throw new Error('Failed to generate mocking response');
  }
}

export async function generateAudio(message: string): Promise<string> {
  try {
    const input = {
      gen_text: message,
      ref_text: "you look fruity",
      ref_audio: "https://drive.google.com/uc?export=download&id=1pOvnyq4HcYLbVuHwLpnIjEFIP5wvM8NF"
    };

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const result = await replicate.run(
      "x-lance/f5-tts:87faf6dd7a692dd82043f662e76369cab126a2cf1937e25a9d41e0b834fd230e",
      { input }
    );
    
    return result;
  } catch (error) {
    console.error('Error generating mocking response:', error);
    throw new Error('Failed to generate mocking response');
  }
}