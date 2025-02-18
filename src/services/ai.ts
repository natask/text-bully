import axios from 'axios';

const API_BASE_URL = 'http://172.236.100.240:3000';

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
    console.log(response.data);
    return response.data.response;
  } catch (error) {
    console.error('Error generating mocking audio:', error);
    throw new Error('Failed to generate mocking audio');
  }
}

export async function generateVideo(audioFilePath: string): Promise<string> {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/video`, { 
      audioFilePath,
      message: "are_you_really_correct"
    });
    
    // Return the full URL to the video
    return `${API_BASE_URL}${response.data.videoUrl}`;
  } catch (error) {
    console.error('Error generating video:', error);
    throw new Error('Failed to generate video');
  }
}