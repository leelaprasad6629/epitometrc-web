/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";

export interface UseAvatarSpeechProps {
  onTranscriptChange: (text: string) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onListeningEnd?: () => void;
  onListeningError?: (err: string) => void;
}

export function useAvatarSpeech({
  onTranscriptChange,
  onSpeechStart,
  onSpeechEnd,
  onListeningEnd,
  onListeningError,
}: UseAvatarSpeechProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setIsSupported(true);
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = "en-US";

        recog.onresult = (event: any) => {
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            onTranscriptChange(finalTranscript);
          }
        };

        recog.onerror = (event: any) => {
          console.error("Speech Recognition Error:", event.error);
          if (onListeningError) {
            onListeningError(`Microphone error: ${event.error}. Please check permissions.`);
          }
          setIsListening(false);
        };

        recog.onend = () => {
          setIsListening(false);
          if (onListeningEnd) {
            onListeningEnd();
          }
        };

        recognitionRef.current = recog;
      }
    }
  }, []);

  // Speak Text using Web SpeechSynthesis API
  const speakText = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      
      // Remove any code blocks or special character formatting for cleaner reading
      const cleanedText = text.replace(/```[\s\S]*?```/g, "[Coding challenge displayed below]").trim();
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        if (onSpeechStart) onSpeechStart();
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onSpeechEnd) onSpeechEnd();
      };
      
      utterance.onerror = (e) => {
        console.error("Speech Synthesis Error:", e);
        setIsSpeaking(false);
        if (onSpeechEnd) onSpeechEnd();
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const cancelSpeech = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      if (onListeningError) {
        onListeningError("Speech Recognition API is not supported in this browser. Please use Chrome.");
      }
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Cancel speech first so user doesn't record the avatar's voice
      cancelSpeech();
      
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech Recognition failed to start:", err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    isSpeaking,
    isSupported,
    speakText,
    cancelSpeech,
    toggleListening,
    stopListening,
  };
}

// Dummy component to satisfy import structures
export default function AvatarSpeechComponent() {
  return null;
}
