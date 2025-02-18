import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import fs from 'fs';

ffmpeg.setFfmpegPath(ffmpegPath);

async function getMediaDuration(filePath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) reject(err);
            resolve(metadata.format.duration);
        });
    });
}

async function mergeVideoWithAudio(wavPath, videoPath, outputPath) {
    try {
        // Get audio duration
        const audioDuration = await getMediaDuration(wavPath);

        return new Promise((resolve, reject) => {
            ffmpeg()
                .input(videoPath)
                .inputOptions(['-stream_loop -1']) // Loop video
                .input(wavPath)
                .addOutputOptions([
                    '-c:v copy',           // Copy video codec (no re-encoding)
                    `-t ${audioDuration}`, // Match audio duration
                    '-shortest',           // End when shortest input ends
                ])
                .save(outputPath)
                .on('end', () => {
                    resolve(outputPath);
                })
                .on('error', (err) => {
                    reject(err);
                });
        });
    } catch (error) {
        console.error('Error in mergeVideoWithAudio:', error);
        throw error;
    }
}

export { mergeVideoWithAudio };