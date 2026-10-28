import React, { useState, useEffect } from 'react';
import {
  X,
  AudioLines,
  Square,
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
import { FieldSelectorModal } from './FieldSelectorModal';

interface VoiceAssistantModalProps {
  language: Language;
  profile: FarmerProfile;
  onClose: () => void;
  onNavigateAction: (actionId: string) => void;
  initialQuery?: string;
  onSelectField?: (fieldId: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  language,
  profile,
  onClose,
  onNavigateAction,
  initialQuery,
  onSelectField,
}) => {
  const t = translations[language];
  const [activeFieldId, setActiveFieldId] = useState<string>(profile.activeFieldId || profile.fields[0]?.id || '');
  const [isFieldSelectorOpen, setIsFieldSelectorOpen] = useState(false);

  const activeField = profile.fields.find((f) => f.id === activeFieldId) || profile.fields[0];

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
            variety: activeField?.variety,
            acreage: activeField?.acreage,
            acreageUnit: activeField?.acreageUnit,
            soilType: activeField?.soilType,
            cropStage: activeField?.cropStage,
            sowingDate: activeField?.sowingDate,
            currentPlannedFertilizer: activeField?.currentPlannedFertilizer,
            previousFertilizerUsed: activeField?.previousFertilizerUsed,
            currentCropProblem: activeField?.currentCropProblem || activeField?.recentProblems?.[0],
            fertilizers: activeField?.fertilizerHistory?.map((f) => f.productName) || [],
            soilSummary: activeField?.soilHealthSummary,
            location: activeField?.location || profile.location,
          },
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Voice assistant response failed');
      }

      const reply = data.reply;
      // Show LONG, DETAILED explanation! Include spoken summary first, then complete multi-paragraph detailed agronomic guidance!
      const fullText = reply.detailedExplanation
        ? (reply.spokenResponse && reply.spokenResponse.trim() !== reply.detailedExplanation.trim()
            ? `${reply.spokenResponse}\n\n${reply.detailedExplanation}`
            : reply.detailedExplanation)
        : reply.spokenResponse;

      setConversation((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: fullText,
          quickButtons: reply.quickActionButtons,
          warning: reply.safetyWarning,
        },
      ]);

      // Speak audio summary aloud
      if (reply.spokenResponse) {
        SpeechService.speak(reply.spokenResponse, language);
      }
    } catch (err) {
      console.warn('Voice assistant notice:', err);

      // Fallback response with Direct Answers First & Numbered Steps
      let fallbackText =
        language === 'mr'
          ? 'आपल्या पिकाच्या चांगल्या वाढीसाठी योग्य ओलावा आणि वेळेवर तणनियंत्रण ठेवा.'
          : language === 'hi'
          ? 'फसल की अच्छी वृद्धि के लिए उचित नमी और समय पर खरपतवार नियंत्रण रखें।'
          : 'Ensure optimal moisture and timely weed management for healthy crop growth.';
      let buttons: any[] = [{ label: '📸 पिकाचा फोटो तपासा', actionType: 'SCAN_CROP' }];

      if (textToSend.includes('पिवळ') || textToSend.includes('पीले') || textToSend.includes('yellow')) {
        fallbackText =
          language === 'mr'
            ? 'पाने पिवळी पडण्यावर थेट उपाय:\n१. शेतात पाणी साचले असल्यास अतिरिक्त पाण्याचा त्वरित निचरा करा.\n२. १९:१९:१९ विद्राव्य खत ५ ग्रॅम प्रति लिटर पाण्यात मिसळून फवारणी करा.\n३. पानाच्या खाली बारीक किडी असल्यास ५% निंबोळी अर्क फवारा.\n(लक्षणे संशयास्पद असल्यास अचूक खात्रीसाठी आपण पानाच्या खालच्या भागाचा फोटोही जोडू शकता.)'
            : language === 'hi'
            ? 'पत्तियां पीली पड़ने का सीधा समाधान:\n1. खेत में जलभराव हो तो पानी की तुरंत निकासी करें।\n2. 19:19:19 घुलनशील खाद 5 ग्राम प्रति लीटर पानी में मिलाकर छिड़कें।\n3. पत्ती के नीचे रस चूसक कीट हों तो 5% नीम अर्क का छिड़काव करें।\n(सटीक पुष्टि के लिए आप पत्ती की फोटो भी अपलोड कर सकते हैं।)'
            : 'Direct solution for yellowing leaves:\n1. Drain any standing water around root zones.\n2. Spray water-soluble 19:19:19 @ 5g per liter water.\n3. If tiny pests are under leaves, spray 5% neem extract.\n(For precise confirmation, you can also upload a clear leaf photo.)';
        buttons = [
          { label: '📸 पानाचा फोटो जोडा', actionType: 'SCAN_CROP' },
          { label: '🧴 खताची मात्रा तपासा', actionType: 'CHECK_FERTILIZER' },
        ];
      } else if (textToSend.includes('खत') || textToSend.includes('खाद') || textToSend.includes('fertilizer')) {
        fallbackText =
          language === 'mr'
            ? 'खत व्यवस्थापनासाठी थेट मार्गदर्शन:\n१. जमिनीत पुरेसा ओलावा असल्यावरच खत द्यावे.\n२. डीएपी व कॅल्शियम नायट्रेट कधीही एकत्र मिसळू नका.\n३. फवारणी करताना पानांच्या खालच्या बाजूवरही द्रावण पोहोचू द्या.'
            : language === 'hi'
            ? 'खाद प्रबंधन का सीधा समाधान:\n1. मिट्टी में पर्याप्त नमी होने पर ही खाद दें।\n2. डीएपी और कैल्शियम नाइट्रेट कभी एक साथ न मिलाएं।\n3. छिड़काव सुबह या शाम शांत मौसम में करें।'
            : 'Direct fertilizer guidance:\n1. Apply fertilizer only when soil has adequate moisture.\n2. Never tank-mix DAP and Calcium Nitrate.\n3. Spray during cool morning hours.';
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
    else if (actionType === 'CHECK_ANIMAL_HEALTH') onNavigateAction('livestock', 'health');
    else if (actionType === 'LOG_MILK') onNavigateAction('livestock', 'milk');
    else if (actionType === 'VIEW_LIVESTOCK') onNavigateAction('livestock', 'overview');
    else if (actionType === 'VIEW_WEATHER') onNavigateAction('weather');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-stone-50 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-blue-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-800 rounded-xl">
              <AudioLines className="w-5 h-5 text-blue-200" />
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

        {/* Active Field Banner */}
        {activeField && (
          <div className="bg-blue-50/90 border-b border-blue-100 px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="text-sm">🌾</span>
              <span className="font-bold text-blue-950 truncate">
                {activeField.name}: <span className="text-blue-700 font-semibold">{activeField.crop}</span>
                <span className="text-stone-500 text-[11px] font-normal ml-1">
                  ({activeField.acreage} {activeField.acreageUnit || 'एकर'}, {activeField.cropStage})
                </span>
              </span>
            </div>
            {profile.fields.length > 1 && (
              <button
                type="button"
                onClick={() => setIsFieldSelectorOpen(true)}
                className="shrink-0 ml-2 px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-700 font-bold text-[11px] rounded-lg border border-blue-200 transition-colors shadow-xs cursor-pointer"
              >
                बदला
              </button>
            )}
          </div>
        )}

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
                <div className="space-y-1.5">
                  {msg.text.split('\n').map((line, lIdx) => {
                    const isStep = /^[0-9१२३४५६७८९]+\.\s*/.test(line.trim());
                    if (isStep) {
                      const numberPrefix = line.match(/^[0-9१२३४५६७८९]+\./)?.[0] || '';
                      const stepContent = line.replace(/^[0-9१२३४५६७८९]+\.\s*/, '');
                      return (
                        <div key={lIdx} className="flex items-start gap-1.5 py-0.5 font-medium text-stone-800">
                          <span className="font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[11px] shrink-0">
                            {numberPrefix}
                          </span>
                          <span className="text-stone-800 leading-relaxed">{stepContent}</span>
                        </div>
                      );
                    }
                    return (
                      <p key={lIdx} className="leading-relaxed">
                        {line}
                      </p>
                    );
                  })}
                </div>

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
            {isRecording ? <Square className="w-6 h-6 fill-current animate-pulse" /> : <AudioLines className="w-6 h-6" />}
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

      {isFieldSelectorOpen && (
        <FieldSelectorModal
          language={language}
          fields={profile.fields}
          activeFieldId={activeFieldId}
          onSelectField={(id) => {
            setActiveFieldId(id);
            if (onSelectField) onSelectField(id);
            setIsFieldSelectorOpen(false);
          }}
          onClose={() => setIsFieldSelectorOpen(false)}
        />
      )}
    </div>
  );
};
