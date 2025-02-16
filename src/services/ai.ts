// AI service for generating mocking responses

export async function generateMockingResponse(input: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:3000/api/mock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input })
    });

    if (!response.ok) {
      throw new Error('Failed to generate response');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error generating mocking response:', error);
    throw new Error('Failed to generate mocking response');
  }
}