
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface ProcessingStatusProps {
  status: 'idle' | 'processing' | 'complete' | 'error';
  progress: number;
}

const ProcessingStatus = ({ status, progress }: ProcessingStatusProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'bg-purple-500';
      case 'complete':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'processing':
        return 'Crafting your comeback...';
      case 'complete':
        return 'Roast ready!';
      case 'error':
        return 'Failed to bully';
      default:
        return 'Ready to bully';
    }
  };

  return (
    <div className="w-full space-y-4 animate-fade-up">
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className={`${getStatusColor()} text-white flex items-center gap-2`}>
          {status === 'processing' && <Loader2 className="w-3 h-3 animate-spin" />}
          {getStatusText()}
        </Badge>
        <span className="text-sm text-purple-700 font-medium">{progress}%</span>
      </div>
      <Progress 
        value={progress} 
        className="h-2 bg-gradient-to-r from-red-500 via-purple-500 to-orange-500" 
      />
    </div>
  );
};

export default ProcessingStatus;
