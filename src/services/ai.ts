import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export async function generateMockingResponse(input: string): Promise<string> {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/mock`, { input });
    return response.data.response;
  } catch (error) {
    console.error('Error generating mocking response:', error);
    throw new Error('Failed to generate mocking response');
  }
}