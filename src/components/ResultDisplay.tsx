
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Download, MessageSquare } from "lucide-react";

interface ResultDisplayProps {
  text: string;
  audioUrl?: string;
  videoUrl?: string;
  onPlay: () => void;
  onDownload: () => void;
}

const ResultDisplay = ({ text, audioUrl, videoUrl, onPlay, onDownload }: ResultDisplayProps) => {
  if (!text) return null;

  return (
    <Card className="w-full p-6 space-y-4 animate-fade-up bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-sm border-2 border-white/50 shadow-xl">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-purple-600">
          <MessageSquare className="w-5 h-5" />
          <h3 className="text-sm font-medium">Your Savage Comeback</h3>
        </div>
        <p className="text-gray-800 font-medium leading-relaxed">{text}</p>
      </div>
      
      {(audioUrl || videoUrl) && (
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-2 bg-purple-500 text-white hover:bg-purple-600 transition-all duration-200"
            onClick={onPlay}
          >
            <Play size={16} />
            Play
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
            onClick={onDownload}
          >
            <Download size={16} />
            Download
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ResultDisplay;
