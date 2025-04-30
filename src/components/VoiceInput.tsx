
import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type VoiceInputProps = {
  onTextCapture: (text: string) => void;
  isListening?: boolean;
  placeholder?: string;
};

const VoiceInput = ({ 
  onTextCapture, 
  isListening: externalIsListening, 
  placeholder = "Click the mic to speak" 
}: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  
  // Use external listening state if provided
  const listeningState = externalIsListening !== undefined ? externalIsListening : isListening;

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      console.error("Speech recognition is not supported in this browser");
    }
    
    return () => {
      // Cleanup 
    };
  }, []);
  
  const toggleListening = () => {
    // If external control is provided, don't toggle internal state
    if (externalIsListening !== undefined) {
      return;
    }
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const startListening = () => {
    // This is a mock implementation
    // In a real app, you would use the Web Speech API
    setIsListening(true);
    setTranscript("");
    
    // For demo, simulate capturing audio after 3 seconds
    setTimeout(() => {
      const mockTranscript = "This is a simulated voice input. In production, this would connect to the backend Whisper API.";
      setTranscript(mockTranscript);
      onTextCapture(mockTranscript);
      setIsListening(false);
    }, 3000);
  };
  
  const stopListening = () => {
    setIsListening(false);
    // In a real implementation, you would stop the recognition here
  };

  if (!isSupported) {
    return (
      <div className="flex items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Voice input is not supported in your browser. Please try a different browser or use text input.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      {transcript && (
        <div className="w-full p-3 bg-white dark:bg-gray-700 rounded-lg text-sm">
          "{transcript}"
        </div>
      )}
      
      {!transcript && !listeningState && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">{placeholder}</p>
      )}
      
      <div className="relative">
        <Button
          onClick={toggleListening}
          className={`rounded-full w-16 h-16 flex items-center justify-center ${
            listeningState 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-vidya-primary hover:bg-vidya-dark"
          }`}
        >
          {listeningState ? <MicOff size={24} /> : <Mic size={24} />}
        </Button>
        
        {listeningState && (
          <div className="absolute inset-0 rounded-full animate-pulse border-4 border-red-300 -z-10"></div>
        )}
      </div>
      
      {listeningState && (
        <p className="text-red-500 dark:text-red-400 animate-pulse text-sm">Listening...</p>
      )}
    </div>
  );
};

export default VoiceInput;
