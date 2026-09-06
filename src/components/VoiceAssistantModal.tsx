import React, { useState, useEffect } from 'react';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Send,
  AlertTriangle,
  Camera,
  FlaskConical,
  CloudSun,
  PhoneCall,
  BookOpen,
} from 'lucide-react';
import { Language, FarmerProfile } from '../types';
import { translations } from '../locales/translations';
import { createSpeechRecognizer, SpeechService } from '../utils/speech';

interface VoiceAssistantModalProps {
  language: Language;
  profile: FarmerProfile;
  onClose: () => void;
  onNavigateAction: (actionId: string) => void;
  initialQuery?: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  language,
  profile,
  onClose,
  onNavigateAction,
  initialQuery,
}) => {
  const t = translations[language];
  const activeField = profile.fields.find((f) => f.id === profile.activeFieldId) || profile.fields[0];

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const [recognizer, setRecognizer] = useState<any>(null);

  const [conversation, setConversation] = useState<
    {
      sender: 'user' | 'assistant';
      text: string;
      quickButtons?: { label: string; actionType: string }[];
      warning?: string | null;
    }[]
  >([
    {
      sender: 'assistant',
      text:
        language === 'mr'
          ? `नमस्कार शेतकरी बंधू! मी तुमचा डिजिटल कृषी मित्र आहे. तुमच्या शेताबद्दल, खताबद्दल किंवा पिकाच्या रोगाबद्दल काहीही विचारा.`
          : language === 'hi'
          ? `नमस्ते किसान भाई! मैं आपका डिजिटल कृषि मित्र हूँ। अपनी फसल, खाद या बीमारी के बारे में कोई भी प्रश्न पूछें।`
          : `Hello Farmer friend! I am your Kisan Mitra. Ask me any question about your crops, fertilizer, or weather.`,
      quickButtons: [
        { label: '📸 पिकाचा फोटो स्कॅन करा', actionType: 'SCAN_CROP' },
        { label: '🧴 खताची सुसंगतता तपासा', actionType: 'CHECK_FERTILIZER' },
      ],
    },
  ]);

  useEffect(() => {
    if (initialQuery) {
      handleSendQuery(initialQuery);
    }
  }, [initialQuery]);

  const startVoiceRecording = () => {
    const rec = createSpeechRecognizer(
      language,
      (result) => {
        setTranscript(result.transcript);
        if (result.isFinal) {
          setIsRecording(false);
          handleSendQuery(result.transcript);
        }
      },
      (err) => {
        console.warn('Voice rec error:', err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    if (rec) {
      try {
        rec.start();
        setIsRecording(true);
        setRecognizer(rec);
      } catch (e) {
        console.error('Failed to start voice rec:', e);
      }
    } else {
      alert('तुमच्या ब्राऊझरमध्ये व्हॉइस रेकग्निशन उपलब्ध नाही. कृपया खाली प्रश्न टाईप करा किंवा नमुना प्रश्न निवडा.');
    }
  };

  const stopVoiceRecording = () => {
    if (recognizer) {
      try {
        recognizer.stop();
      } catch (e) {}
    }
    setIsRecording(false);
  };

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || transcript;
    if (!textToSend.trim()) return;

    // Add user query to conversation
    setConversation((prev) => [...prev, { sender: 'user', text: textToSend }]);
    setTranscript('');
    setLoading(true);

    try {
      const response = await fetch('/api/voice/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speechText: textToSend,
          farmContext: {
            fieldName: activeField?.name,
            crop: activeField?.crop,
            cropStage: activeField?.cropStage,
            sowingDate: activeField?.sowingDate,
            fertilizers: activeField?.fertilizerHistory.map((f) => f.productName),
            soilSummary: activeField?.soilHealthSummary,
          },
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Voice assistant response failed');
      }

      const reply = data.reply;
      setConversation((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: reply.spokenResponse || reply.detailedExplanation,
          quickButtons: reply.quickActionButtons,
          warning: reply.safetyWarning,
        },
      ]);

      // Speak response aloud automatically for rural audio UX
      SpeechService.speak(reply.spokenResponse, language);
    } catch (err) {
      console.warn('Voice assistant notice:', err);

      // Fallback response based on known query keywords
      let fallbackText = 'माझ्या माहितीनुसार पिकाचे निरीक्षण करणे आवश्यक आहे.';
      let buttons: any[] = [{ label: '📸 फोटो काढून तपासा', actionType: 'SCAN_CROP' }];

      if (textToSend.includes('पिवळ') || textToSend.includes('पीले') || textToSend.includes('yellow')) {
        fallbackText =
          'पाने पिवळी पडण्याची दोन मुख्य कारणे असू शकतात: नत्र (युरिया) ची कमतरता किंवा खालच्या बाजूला रसशोषक किडी. पानांचा एक जवळून फोटो काढून खात्री करा.';
        buttons = [
          { label: '📸 पानाचा फोटो काढा', actionType: 'SCAN_CROP' },
          { label: '📞 तज्ज्ञांशी बोला', actionType: 'CALL_EXPERT' },
        ];
      } else if (textToSend.includes('खत') || textToSend.includes('खाद') || textToSend.includes('fertilizer')) {
        fallbackText =
          'कोणतेही खत देण्यापूर्वी ते पिकाच्या योग्य अवस्थेत आहे का आणि आधीच्या खताशी विरोध करत नाही ना याची खात्री करणे आवश्यक आहे. खत स्कॅन करा.';
        buttons = [{ label: '🧴 खताचे पाकीट तपासा', actionType: 'CHECK_FERTILIZER' }];
      }

      setConversation((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: fallbackText,
          quickButtons: buttons,
        },
      ]);
      SpeechService.speak(fallbackText, language);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (actionType: string) => {
    SpeechService.stop();
    onClose();
    if (actionType === 'SCAN_CROP') onNavigateAction('scan_crop');
    else if (actionType === 'CHECK_FERTILIZER') onNavigateAction('check_fertilizer');
    else if (actionType === 'CALL_EXPERT') onNavigateAction('ask_expert');
    else if (actionType === 'LOG_DIARY') onNavigateAction('farm_diary');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-stone-50 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-blue-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-800 rounded-xl">
              <Mic className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-snug">{t.voiceTitle}</h3>
              <p className="text-xs text-blue-100">तुमच्या भाषेत शेतीविषयी बोला</p>
            </div>
          </div>
          <button
            onClick={() => {
              SpeechService.stop();
              onClose();
            }}
            className="p-2 hover:bg-blue-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="p-4 space-y-3.5 overflow-y-auto flex-1">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white font-semibold rounded-br-xs'
                    : 'bg-white text-stone-900 border border-stone-200 rounded-bl-xs'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="flex items-center justify-between gap-2 mb-1 border-b border-stone-100 pb-1">
                    <span className="font-bold text-[10px] text-blue-800 uppercase flex items-center gap-1">
                      <span>🌾</span>
                      <span>कृषी मित्र (Kisan Mitra)</span>
                    </span>
                    <button
                      onClick={() => SpeechService.speak(msg.text, language)}
                      className="p-1 rounded text-stone-500 hover:text-blue-700"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <div>{msg.text}</div>

                {/* Safety warning if applicable */}
                {msg.warning && (
                  <div className="mt-2 p-2 bg-rose-50 border border-rose-300 rounded-xl text-[11px] text-rose-900 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{msg.warning}</span>
                  </div>
                )}
              </div>

              {/* Quick Action Buttons suggested by AI */}
              {msg.quickButtons && msg.quickButtons.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%]">
                  {msg.quickButtons.map((btn, bIdx) => (
                    <button
                      key={bIdx}
                      onClick={() => handleQuickAction(btn.actionType)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-full font-bold text-xs shadow-2xs active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>{btn.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-stone-500 italic p-2 bg-white rounded-xl border border-stone-200 w-fit">
              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>कृषी मित्र विचार करत आहे...</span>
            </div>
          )}
        </div>

        {/* Sample Voice Prompts for 1-tap test */}
        <div className="px-4 py-2 bg-stone-100 border-t border-stone-200">
          <div className="text-[11px] font-bold text-stone-600 mb-1">
            नमुना प्रश्न (टॅप करा):
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {t.voiceSamplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendQuery(prompt)}
                className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 rounded-lg text-[11px] font-medium shrink-0 cursor-pointer"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>

        {/* Audio Recording & Input Bar */}
        <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
          <button
            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
            className={`p-3.5 rounded-2xl flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-md ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
            placeholder={isRecording ? t.voiceListening : t.voiceTapToSpeak}
            className="flex-1 p-3 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => handleSendQuery()}
            disabled={!transcript.trim() || loading}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-stone-300 text-white rounded-xl shadow-sm cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
