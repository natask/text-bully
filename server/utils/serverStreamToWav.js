import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import fetch from 'node-fetch';

/**
 * Converts a stream or URL to a WAV buffer and saves it for debugging
 * @param {string|Readable} input - URL or readable stream
 * @param {string} outputDir - Directory to save the WAV file for debugging
 * @param {string} [filename] - Optional custom filename, if not provided a timestamp will be used
 * @returns {Promise<{buffer: Buffer, filePath: string}>} - WAV buffer and debug file path
 */
export async function serverStreamToWav(input, outputDir, filename) {
  try {
    let buffer;
    
    if (typeof input === 'string') {
      // If input is a URL, fetch it
      const response = await fetch(input);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      buffer = await response.buffer();
    } else if (input instanceof Readable) {
      // If input is a Readable stream
      const chunks = [];
      for await (const chunk of input) {
        chunks.push(chunk);
      }
      buffer = Buffer.concat(chunks);
    } else {
      throw new Error('Input must be either a URL string or a Readable stream');
    }

    // Validate WAV header
    if (buffer.length < 44) {
      throw new Error('Invalid WAV file: too short');
    }

    const riff = buffer.toString('ascii', 0, 4);
    const wave = buffer.toString('ascii', 8, 12);

    if (riff !== 'RIFF' || wave !== 'WAVE') {
      throw new Error('Invalid WAV file format');
    }

    // Use provided filename or generate one with timestamp
    const actualFilename = filename || `debug-audio-${new Date().toISOString().replace(/[:.]/g, '-')}.wav`;
    const filePath = path.join(outputDir, actualFilename);

    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the buffer to file for debugging
    await fs.promises.writeFile(filePath, buffer);

    return { buffer, filePath };
  } catch (error) {
    console.error('Error processing audio:', error);
    throw error;
  }
}
