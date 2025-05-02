
import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { transcribeAudio } from "@/services/AIService";
import { useOffline } from "@/contexts/OfflineContext";

type EnhancedVoiceInputProps = {
  onTextCapture: (text: string) => void;
  isListening?: boolean;
  placeholder?: string;
  language?: string;
};

const EnhancedVoiceInput = ({ 
  onTextCapture, 
  isListening: externalIsListening, 
  placeholder = "Click the mic to speak",
  language = "en" 
}: EnhancedVoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { isOnline } = useOffline();
  
  // Use external listening state if provided
  const listeningState = externalIsListening !== undefined ? externalIsListening : isListening;

  useEffect(() => {
    // Check if browser supports MediaRecorder
    if (!('MediaRecorder' in window)) {
      setIsSupported(false);
      console.error("MediaRecorder is not supported in this browser");
    }
    
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
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
  
  const startListening = async () => {
    setTranscript("");
    setAudioChunks([]);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks(prev => [...prev, e.data]);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        setIsListening(false);
        setIsProcessing(true);
        
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(',')[1];
          
          if (base64Audio) {
            if (isOnline) {
              // Send to Whisper API for transcription
              const result = await transcribeAudio(base64Audio, language);
              
              if (result.success) {
                setTranscript(result.text);
                onTextCapture(result.text);
              } else {
                console.error("Transcription error:", result.error);
                setTranscript("Sorry, I couldn't understand that. Please try again.");
              }
            } else {
              // Offline fallback - simple message
              setTranscript("Voice recognition is not available offline.");
              onTextCapture("Voice recognition is not available offline.");
            }
          }
          
          setIsProcessing(false);
        };
      };
      
      mediaRecorderRef.current.start();
      setIsListening(true);
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setIsSupported(false);
    }
  };
  
  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Voice input is not supported on your device. Please try a different browser or use text input instead.
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
      
      {!transcript && !listeningState && !isProcessing && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">{placeholder}</p>
      )}
      
      <div className="relative">
        <Button
          onClick={toggleListening}
          disabled={isProcessing}
          className={`rounded-full w-16 h-16 flex items-center justify-center ${
            listeningState 
              ? "bg-red-500 hover:bg-red-600" 
              : isProcessing
                ? "bg-gray-400"
                : "bg-vidya-primary hover:bg-vidya-dark"
          }`}
        >
          {isProcessing ? <Loader2 size={24} className="animate-spin" /> : 
           listeningState ? <MicOff size={24} /> : <Mic size={24} />}
        </Button>
        
        {listeningState && (
          <div className="absolute inset-0 rounded-full animate-pulse border-4 border-red-300 -z-10"></div>
        )}
      </div>
      
      {listeningState && (
        <p className="text-red-500 dark:text-red-400 animate-pulse text-sm">Listening...</p>
      )}
      
      {isProcessing && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">Processing your speech...</p>
      )}
    </div>
  );
};

export default EnhancedVoiceInput;
