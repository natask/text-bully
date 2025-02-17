import React, { useState } from 'react';
import TextInput from '@/components/TextInput';
import ProcessingStatus from '@/components/ProcessingStatus';
import ResultDisplay from '@/components/ResultDisplay';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Zap, MessageSquare } from "lucide-react";
import { generateMockingResponse, generateAudio } from '@/services/ai';
import { mergeVideoWithAudio } from '@/services/mergeVideoAudio';
const Index = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const {
    toast
  } = useToast();
  const handleProcess = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message first",
        variant: "destructive"
      });
      return;
    }
    setStatus('processing');
    setProgress(0);

    try {
      // Step 1: Text analysis
      await simulateProgress(0, 30);
      
      // Step 2: Generate mocking response
      const mockingResponse = await generateMockingResponse(message);
      await simulateProgress(30, 60);

      // Step 3: Text to speech (placeholder)
      const audioUrl = await generateAudio(mockingResponse);
      await simulateProgress(60, 90);

      // Step 4: Video generation (placeholder)
      const videoUrl = await mergeVideoWithAudio(audioUrl);
      setVideoUrl(videoUrl);

      await simulateProgress(90, 100);
      setResult(mockingResponse);
      setStatus('complete');
      toast({
        title: "Success",
        description: "Processing completed successfully"
      });
    } catch (error) {
      setStatus('error');
      toast({
        title: "Error",
        description: "An error occurred during processing",
        variant: "destructive"
      });
    }
  };
  const simulateProgress = (start: number, end: number) => {
    return new Promise<void>(resolve => {
      let current = start;
      const interval = setInterval(() => {
        if (current >= end) {
          clearInterval(interval);
          resolve();
        } else {
          current += 2;
          setProgress(current);
        }
      }, 50);
    });
  };
  const handlePlay = () => {
    toast({
      title: "Info",
      description: "Play functionality will be implemented in the next version"
    });
  };
  const handleDownload = () => {
    toast({
      title: "Info",
      description: "Download functionality will be implemented in the next version"
    });
  };
  return <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-red-50 to-orange-50">
      {/* Bouncing background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[40rem] h-[40rem] bg-purple-200/20 rounded-full -top-48 -left-48 animate-[bounce_8s_ease-in-out_infinite]" />
        <div className="absolute w-[35rem] h-[35rem] bg-red-200/30 rounded-full top-1/2 -translate-y-1/2 -right-64 animate-[bounce_7s_ease-in-out_infinite_0.5s]" />
        <div className="absolute w-[30rem] h-[30rem] bg-orange-200/20 rounded-full -bottom-48 -left-48 animate-[bounce_6s_ease-in-out_infinite_1s]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/50 to-white/0 backdrop-blur-[1px]" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="container max-w-2xl space-y-8">
          <div className="text-center space-y-4 animate-fade-up">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <MessageSquare className="w-12 h-12 text-red-500" />
              <h1 className="font-black tracking-tight bg-gradient-to-r from-red-600 via-purple-600 to-orange-500 bg-clip-text text-transparent text-6xl">
                Text Bully
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Transform your text into a savage comeback</p>
          </div>

          <div className="space-y-6 backdrop-blur-sm bg-white/30 p-8 rounded-2xl border border-white/50 shadow-lg">
            <TextInput value={message} onChange={setMessage} />
            
            <div className="flex justify-center">
              <Button onClick={handleProcess} disabled={status === 'processing'} className="min-w-[200px] bg-gradient-to-r from-red-500 via-purple-500 to-orange-500 hover:from-red-600 hover:via-purple-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg group">
                <Zap className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                Bully This Text
              </Button>
            </div>

            {status !== 'idle' && <ProcessingStatus status={status} progress={progress} />}

            {status === 'complete' && <ResultDisplay text={result} onPlay={handlePlay} onDownload={handleDownload} videoUrl={videoUrl} />}
          </div>
        </div>
      </div>
    </div>;
};
export default Index;