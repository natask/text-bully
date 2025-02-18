import axios from 'axios';
import Replicate from "replicate";
import { writeFile, readFile } from "node:fs/promises";
import { streamToWavFile } from '@/utils/streamToFile';

const API_BASE_URL = 'https://text-bully-git-main-natasks-projects.vercel.app:3000/';

export async function generateMockingResponse(input: string): Promise<string> {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/mock`, { input });
    console.log(response.data);
    return response.data.response;
  } catch (error) {
    console.error('Error generating mocking response:', error);
    throw new Error('Failed to generate mocking response');
  }
}

export async function generateAudio(message: string): Promise<string> {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/audio`, { message });
    // Convert the audio URL to a blob URL that can be played in the browser
    console.log(response.data);
    return response.data.response;
  } catch (error) {
    console.error('Error generating mocking audio:', error);
    throw new Error('Failed to generate mocking audio');
  }
}

export async function generateVideo(audioFilePath: string): Promise<string> {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/video`, { audioFilePath });
    // Convert the audio URL to a blob URL that can be played in the browser
    console.log(response.data);
    return response.data.response;
  } catch (error) {
    console.error('Error generating mocking video:', error);
    throw new Error('Failed to generate mocking video');
  }
}