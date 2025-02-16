
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle } from "lucide-react";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TextInput = ({ value, onChange }: TextInputProps) => {
  return (
    <div className="w-full space-y-2 animate-fade-up">
      <Label htmlFor="message" className="text-sm font-medium flex items-center gap-2 text-purple-700">
        <MessageCircle className="w-4 h-4" />
        Your message to be bullied
      </Label>
      <Textarea
        id="message"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type or paste the message you want to make fun of..."
        className="min-h-[150px] resize-none rounded-lg border-2 border-purple-200 bg-white/70 backdrop-blur-sm transition-all focus:border-purple-300 focus:ring-2 focus:ring-purple-200 focus:ring-opacity-50 shadow-inner"
      />
    </div>
  );
};

export default TextInput;
