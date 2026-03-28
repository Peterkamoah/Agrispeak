import { ref } from 'vue';

export function useSpeechRecognition() {
  const isSupported = ref('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  const isListening = ref(false);
  const transcript = ref('');
  const error = ref(null);

  let recognition = null;

  if (isSupported.value) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      isListening.value = true;
      error.value = null;
    };

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      transcript.value = currentTranscript;
    };

    recognition.onerror = (event) => {
      isListening.value = false;
      if (event.error === 'not-allowed') {
        error.value = 'Microphone access denied';
      } else if (event.error === 'no-speech') {
        error.value = 'No speech detected';
      } else {
        error.value = `Speech recognition error: ${event.error}`;
      }
    };

    recognition.onend = () => {
      isListening.value = false;
    };
  }

  const startListening = (language = 'ak-GH') => {
    if (!isSupported.value) {
      error.value = 'Voice input not supported on this device';
      return;
    }
    
    // Set language (fallback to English if not provided, though ak-GH is our primary Twi target)
    recognition.lang = language === 'tw' ? 'ak-GH' : 'en-US';
    
    transcript.value = '';
    error.value = null;
    
    try {
      recognition.start();
    } catch (e) {
      // In case it's already started
      console.error(e);
    }
  };

  const stopListening = () => {
    if (recognition && isListening.value) {
      recognition.stop();
      isListening.value = false;
    }
  };

  return {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening
  };
}
