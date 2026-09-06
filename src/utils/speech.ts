// Web Speech Synthesis and Speech Recognition Service for Farmer Accessibility

export const SpeechService = {
  speak: (text: string, language: 'mr' | 'hi' | 'en' = 'mr') => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // stop previous speaking

    const utterance = new SpeechSynthesisUtterance(text);

    if (language === 'mr') {
      utterance.lang = 'mr-IN';
    } else if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.rate = 0.9; // slightly slower for rural literacy comprehension
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  },

  stop: () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },
};

export function createSpeechRecognizer(
  language: 'mr' | 'hi' | 'en' = 'mr',
  onResult: (result: any) => void,
  onError?: (err: any) => void,
  onEnd?: () => void
) {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (onError) onError('Speech recognition is not supported in this browser.');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;

  if (language === 'mr') {
    recognition.lang = 'mr-IN';
  } else if (language === 'hi') {
    recognition.lang = 'hi-IN';
  } else {
    recognition.lang = 'en-IN';
  }

  recognition.onresult = (event: any) => {
    if (event.results && event.results[0] && event.results[0][0]) {
      const text = event.results[0][0].transcript;
      const isFinal = event.results[0].isFinal;
      // Pass both object format and raw text compatible object
      onResult({
        transcript: text,
        isFinal: isFinal,
        toString: () => text,
      });
    }
  };

  recognition.onerror = (event: any) => {
    if (onError) onError(event.error);
  };

  if (onEnd) {
    recognition.onend = onEnd;
  }

  return recognition;
}

export function startVoiceRecognition(
  language: 'mr' | 'hi' | 'en',
  onResult: (transcript: string) => void,
  onError?: (err: any) => void
) {
  const recognition = createSpeechRecognizer(
    language,
    (res: any) => {
      const text = typeof res === 'string' ? res : res.transcript || '';
      if (text) onResult(text);
    },
    onError
  );

  if (recognition) {
    try {
      recognition.start();
      return recognition;
    } catch (err) {
      if (onError) onError(err);
      return null;
    }
  }
  return null;
}
