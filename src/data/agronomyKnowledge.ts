// Verified agronomic database based on Indian Council of Agricultural Research (ICAR) & State Agricultural Universities (SAUs) guidelines

export interface CropGuide {
  id: string;
  name: { mr: string; hi: string; en: string };
  season: 'Kharif' | 'Rabi' | 'Summer' | 'Annual';
  durationDays: number;
  recommendedNPK_KgPerAcre: { n: number; p: number; k: number };
  stages: { id: string; name: { mr: string; hi: string; en: string }; daysAfterSowing: string }[];
  commonProblems: {
    id: string;
    title: { mr: string; hi: string; en: string };
    type: 'pest' | 'disease' | 'deficiency';
    symptoms: { mr: string; hi: string; en: string };
    organicRemedy: { mr: string; hi: string; en: string };
    chemicalRemedy: { mr: string; hi: string; en: string };
  }[];
}

export const CROPS_DATABASE: CropGuide[] = [
  {
    id: 'cotton',
    name: { mr: 'कापूस (Cotton)', hi: 'कपास (Cotton)', en: 'Cotton' },
    season: 'Kharif',
    durationDays: 160,
    recommendedNPK_KgPerAcre: { n: 48, p: 24, k: 24 }, // Approx 120:60:60 kg/ha
    stages: [
      { id: 'sowing', name: { mr: 'पेरणी / उगवण', hi: 'बुवाई व अंकुरण', en: 'Sowing & Germination' }, daysAfterSowing: '0-20' },
      { id: 'vegetative', name: { mr: 'शाकीय वाढ (झाड भरणे)', hi: 'वानस्पतिक वृद्धि', en: 'Vegetative Growth' }, daysAfterSowing: '20-50' },
      { id: 'flowering', name: { mr: 'पात्या व फुले येणे', hi: 'फूल व कलियां', en: 'Squaring & Flowering' }, daysAfterSowing: '50-85' },
      { id: 'boll_formation', name: { mr: 'बोंडे भरणे व वाढ', hi: 'टिंडे बनना', en: 'Boll Development' }, daysAfterSowing: '85-130' },
      { id: 'maturity', name: { mr: 'बोंडे फुटणे (वेचणी)', hi: 'टिंडे खिलना / तुड़ाई', en: 'Boll Bursting & Picking' }, daysAfterSowing: '130+' },
    ],
    commonProblems: [
      {
        id: 'cotton_thrips_jassids',
        title: { mr: 'रसशोषक किडी (मावा, तुडतुडे, फुलकिडे)', hi: 'रस चूसक कीट (माहू, थ्रिप्स, जेसिड)', en: 'Sucking Pests (Thrips, Aphids, Jassids)' },
        type: 'pest',
        symptoms: {
          mr: 'पाने वरच्या किंवा खालच्या बाजूला वाटीसारखी वळतात, पानाच्या कडा पिवळ्या किंवा तपकिरी पडतात.',
          hi: 'पत्तियां नाव के आकार में मुड़ जाती हैं, किनारों पर पीलापन या सूखापन दिखाई देता है।',
          en: 'Leaves curl upward or downward in boat shape, margins turn yellow and scorched.',
        },
        organicRemedy: {
          mr: '५% निंबोळी अर्क किंवा निम तेल (१०,००० पीपीएम) २.५ मिली प्रति लिटर पाणी + पिवळे/निळे चिकट सापळे एकरी १० लावा.',
          hi: 'नीम का तेल (10,000 ppm) 2.5 मिली प्रति लीटर पानी + 10 पीले व नीले चिपचिपे ट्रैप प्रति एकड़।',
          en: '5% Neem seed kernel extract or Neem oil 2.5 ml/L + install 10 yellow and blue sticky traps/acre.',
        },
        chemicalRemedy: {
          mr: 'प्रादुर्भाव जास्त असल्यास ॲसिटामिप्रीड २०% एसपी @ ०.४ ग्रॅम किंवा थायामेथोक्साम २५% डब्ल्यूजी @ ०.३ ग्रॅम प्रति लिटर पाणी.',
          hi: 'अधिक प्रकोप पर एसिटामिप्रिड 20% SP @ 0.4 ग्राम या थायमेथॉक्सम 25% WG @ 0.3 ग्राम प्रति लीटर।',
          en: 'Acetamiprid 20% SP @ 0.4 g/L or Thiamethoxam 25% WG @ 0.3 g/L if pest crosses ETL.',
        },
      },
      {
        id: 'cotton_mg_deficiency',
        title: { mr: 'मॅग्नेशियम कमतरता (लाल पडणे)', hi: 'मैग्नीशियम की कमी (पत्तियों का लाल होना)', en: 'Magnesium Deficiency (Reddening)' },
        type: 'deficiency',
        symptoms: {
          mr: 'जुन्या पानांच्या शिरांमधील भाग लाल-जांभळा किंवा विटकरी होतो, शिरा हिरव्या राहतात.',
          hi: 'पुरानी पत्तियों की नसों के बीच का भाग लाल या बैंगनी हो जाता है, नसें हरी रहती हैं।',
          en: 'Interveinal tissue of older leaves turns purplish-red while main veins remain green.',
        },
        organicRemedy: {
          mr: 'शेणखत ५ टन प्रति एकर व मुळांजवळ ओलावा टिकवून ठेवा.',
          hi: 'खेत में गोबर की सड़ी खाद दें और नमी बनाए रखें।',
          en: 'Apply well-decomposed FYM and ensure adequate soil moisture.',
        },
        chemicalRemedy: {
          mr: 'मॅग्नेशियम सल्फेट (चिलेटेड किंवा साधे) ५ ग्रॅम प्रति लिटर पाणी किंवा २० किलो प्रति एकर जमिनीत द्या.',
          hi: 'मैग्नीशियम सल्फेट 5 ग्राम प्रति लीटर पानी का छिड़काव या 20 किग्रा प्रति एकड़ भूमि में दें।',
          en: 'Foliar spray of Magnesium Sulphate @ 5 g/L or soil application of 20-25 kg/acre.',
        },
      },
    ],
  },
  {
    id: 'soybean',
    name: { mr: 'सोयाबीन (Soybean)', hi: 'सोयाबीन (Soybean)', en: 'Soybean' },
    season: 'Kharif',
    durationDays: 95,
    recommendedNPK_KgPerAcre: { n: 12, p: 32, k: 16 }, // Approx 30:80:40 kg/ha
    stages: [
      { id: 'sowing', name: { mr: 'पेरणी व उगवण', hi: 'बुवाई व अंकुरण', en: 'Sowing' }, daysAfterSowing: '0-15' },
      { id: 'vegetative', name: { mr: 'झाडांची वाढ', hi: 'शाखीय वृद्धि', en: 'Vegetative' }, daysAfterSowing: '15-35' },
      { id: 'flowering', name: { mr: 'फुलोरा अवस्था', hi: 'फूल आने की अवस्था', en: 'Flowering' }, daysAfterSowing: '35-50' },
      { id: 'pod_filling', name: { mr: 'शेंगा भरणे', hi: 'फलियां बनना', en: 'Pod Filling' }, daysAfterSowing: '50-75' },
      { id: 'maturity', name: { mr: 'पक्वता व कापणी', hi: 'पकना व कटाई', en: 'Maturity' }, daysAfterSowing: '75-95' },
    ],
    commonProblems: [
      {
        id: 'soybean_girdle_beetle',
        title: { mr: 'चक्रीभुंगा (गर्डल बीटल)', hi: 'गर्डल बीटल (चक्री भृंग)', en: 'Girdle Beetle' },
        type: 'pest',
        symptoms: {
          mr: 'फांदीवर किंवा देठावर २ गोल कडी (रिंग) तयार होतात आणि वरील भाग वाळतो.',
          hi: 'डंठल या शाखा पर दो छल्ले जैसी कटिंग बनती है और ऊपरी हिस्सा सूख कर लटक जाता है।',
          en: 'Two circular girdles on stems/petioles; foliage above the girdle withers and drops.',
        },
        organicRemedy: {
          mr: 'कीडग्रस्त फांद्या हाताने तोडून नष्ट करा. निंबोळी अर्क ५% फवारा.',
          hi: 'ग्रसित डंठलों को काटकर नष्ट करें। 5% नीम अर्क का छिड़काव करें।',
          en: 'Hand-pick and destroy girdled plant parts. Spray 5% Neem extract.',
        },
        chemicalRemedy: {
          mr: 'क्लोराँट्रानिलीप्रोल १८.५% एससी @ ०.३ मिली प्रति लिटर पाणी किंवा थायामेथोक्साम + लॅम्बडा सायहेलोथ्रीन @ ०.५ मिली/लिटर.',
          hi: 'क्लोरेंट्रानिलिप्रोल 18.5% SC @ 0.3 मिली प्रति लीटर पानी।',
          en: 'Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Thiamethoxam 12.6% + Lambda-cyhalothrin 9.5% ZC @ 0.5 ml/L.',
        },
      },
    ],
  },
  {
    id: 'onion',
    name: { mr: 'कांदा (Onion)', hi: 'प्याज (Onion)', en: 'Onion' },
    season: 'Rabi',
    durationDays: 120,
    recommendedNPK_KgPerAcre: { n: 40, p: 20, k: 20 },
    stages: [
      { id: 'nursery', name: { mr: 'रोपवाटिका', hi: 'नर्सरी', en: 'Nursery' }, daysAfterSowing: '0-45' },
      { id: 'transplanting', name: { mr: 'पुनर्लागवड', hi: 'रोपाई', en: 'Transplanting' }, daysAfterSowing: '45-60' },
      { id: 'vegetative', name: { mr: 'पातीची वाढ', hi: 'पत्तियों की वृद्धि', en: 'Foliage Growth' }, daysAfterSowing: '60-85' },
      { id: 'bulb_development', name: { mr: 'कांदा पोसणे (गड्डा तयार होणे)', hi: 'कंद बनना', en: 'Bulb Development' }, daysAfterSowing: '85-115' },
    ],
    commonProblems: [
      {
        id: 'onion_purple_blotch',
        title: { mr: 'जांभळा करपा (पर्पल ब्लॉच)', hi: 'बैंगनी धब्बा रोग (पर्पल ब्लॉच)', en: 'Purple Blotch' },
        type: 'disease',
        symptoms: {
          mr: 'पानांवर सुरुवातीला पांढुरके डाग पडून नंतर ते जांभळे-तपकिरी होतात आणि पात वाळते.',
          hi: 'पत्तियों पर सफेद बिंदु बनते हैं जो बाद में केंद्र में बैंगनी होकर फैलते हैं।',
          en: 'Small, whitish sunken lesions develop purple centers; leaves turn brown and fall over.',
        },
        organicRemedy: {
          mr: 'ट्रायकोडर्मा व्हिरीडी ५ ग्रॅम प्रति लिटर पाणी किंवा ताक + हिंग फवारणी.',
          hi: 'ट्राइकोडर्मा 5 ग्राम प्रति लीटर या छाछ का छिड़काव।',
          en: 'Trichoderma viride @ 5 g/L or fermented buttermilk spray.',
        },
        chemicalRemedy: {
          mr: 'मँकोझेब ७५% डब्ल्यूपी @ २.५ ग्रॅम किंवा अझोक्सिस्ट्रोबिन + डिफेनोकोनाझोल @ १ मिली प्रति लिटर पाणी.',
          hi: 'मैंकोजेब 75% WP @ 2.5 ग्राम या एज़ोक्सीस्ट्रोबिन + डाइफेनोकोनाज़ोल @ 1 मिली प्रति लीटर।',
          en: 'Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin + Difenoconazole @ 1 ml/L.',
        },
      },
    ],
  },
  {
    id: 'wheat',
    name: { mr: 'गहू (Wheat)', hi: 'गेहूं (Wheat)', en: 'Wheat' },
    season: 'Rabi',
    durationDays: 115,
    recommendedNPK_KgPerAcre: { n: 48, p: 24, k: 16 },
    stages: [
      { id: 'cri', name: { mr: 'मुकुट मुळे फुटणे (CRI)', hi: 'सीआरआई अवस्था', en: 'Crown Root Initiation' }, daysAfterSowing: '20-25' },
      { id: 'tillering', name: { mr: 'फुटवे येणे', hi: 'कल्ले फूटना', en: 'Tillering' }, daysAfterSowing: '40-45' },
      { id: 'flowering', name: { mr: 'ओंब्या बाहेर पडणे', hi: 'बालियां निकलना', en: 'Heading & Flowering' }, daysAfterSowing: '60-70' },
      { id: 'milking_dough', name: { mr: 'दाणे भरणे (दुधाळ/घट्ट)', hi: 'दाना भराव', en: 'Grain Filling' }, daysAfterSowing: '75-95' },
    ],
    commonProblems: [
      {
        id: 'wheat_rust',
        title: { mr: 'तांबेरा (रस्ट)', hi: 'गेरुआ / रतुआ (रस्ट)', en: 'Wheat Rust (Yellow/Brown Rust)' },
        type: 'disease',
        symptoms: {
          mr: 'पानांवर पिवळ्या किंवा तपकिरी रंगाच्या पावडरसारख्या रेषा/ठिपके येतात, बोटाला पावडर लागते.',
          hi: 'पत्तियों पर पीले या भूरे पाउडर की धारियां बन जाती हैं।',
          en: 'Yellowish-orange pustules in linear stripes on leaf blades.',
        },
        organicRemedy: {
          mr: 'प्रतिरोधक वाणांची निवड व वेळेवर पेरणी. संतुलित खतांचा वापर.',
          hi: 'रोग प्रतिरोधी किस्मों की बुवाई और संतुलित खाद।',
          en: 'Use resistant varieties and avoid excess Nitrogen application.',
        },
        chemicalRemedy: {
          mr: 'प्रोपिकोनाझोल २५% ईसी @ १ मिली प्रति लिटर पाणी फवारा.',
          hi: 'प्रोपिकोनाज़ोल 25% EC @ 1 मिली प्रति लीटर पानी का छिड़काव।',
          en: 'Propiconazole 25% EC @ 1 ml/L at first appearance of pustules.',
        },
      },
    ],
  },
];

// INCOMPATIBLE FERTILIZER COMBINATIONS (AGRONOMIC SAFETY ENGINE)
export interface CompatibilityRule {
  productA: string;
  productB: string;
  severity: 'DANGEROUS' | 'ANTAGONISTIC' | 'CAUTION';
  reason: { mr: string; hi: string; en: string };
  scientificPrinciple: string;
}

export const FERTILIZER_COMPATIBILITY_RULES: CompatibilityRule[] = [
  {
    productA: 'Calcium Nitrate (कॅल्शियम नायट्रेट)',
    productB: 'DAP / Phosphorus / Single Super Phosphate (स्फुरद खते)',
    severity: 'DANGEROUS',
    reason: {
      mr: 'कॅल्शियम आणि फॉस्फरस एकत्र केल्यास विरघळत नाही (कॅल्शियम फॉस्फेटचा खडे/गाळ बनतो). ठिबक व नोझल चोक होतात व झाडांना खत मिळत नाही.',
      hi: 'कैल्शियम और फास्फोरस मिलाने पर अघुलनशील कैल्शियम फास्फेट की तलछट बन जाती है। ड्रिप और नोजल जाम हो जाएंगे।',
      en: 'Mixing Calcium Nitrate with Phosphates (DAP/SSP) forms insoluble Calcium Phosphate precipitate. Clogs drip nozzles and locks nutrients.',
    },
    scientificPrinciple: 'Ca²⁺ + PO₄³⁻ -> Insoluble Ca₃(PO₄)₂ precipitation',
  },
  {
    productA: 'Calcium Nitrate (कॅल्शियम नायट्रेट)',
    productB: 'Sulfate Fertilizers (Ammonium Sulfate, Zinc Sulfate, Potassium Sulfate, MgSO4)',
    severity: 'DANGEROUS',
    reason: {
      mr: 'कॅल्शियम व सल्फेट एकत्र आल्यास जिप्सम (कॅल्शियम सल्फेट) तयार होऊन पांढरा साका बनतो.',
      hi: 'कैल्शियम और सल्फेट मिलने पर जिप्सम जैसा सफेद जमाव बन जाता है जो पौधों को नहीं मिलता।',
      en: 'Calcium reacts with Sulphate ions to precipitate insoluble Calcium Sulphate (Gypsum).',
    },
    scientificPrinciple: 'Ca²⁺ + SO₄²⁻ -> CaSO₄.2H₂O precipitate',
  },
  {
    productA: 'Zinc Sulfate (झिंक सल्फेट)',
    productB: 'DAP / 18:46:0 / SSP (फॉस्फेट खते)',
    severity: 'ANTAGONISTIC',
    reason: {
      mr: 'झिंक आणि डीएपी एकत्र जमिनीत टाकल्यास किंवा फवारल्यास झिंक फॉस्फेट बनते, ज्याने झिंक आणि स्फुरद दोन्ही मातीत फुकट जातात.',
      hi: 'जिंक सल्फेट और डीएपी को कभी एक साथ नहीं मिलाना चाहिए। जिंक फॉस्फेट बनकर दोनों पोषक तत्व बेकार हो जाते हैं।',
      en: 'Applying Zinc Sulfate and Phosphatic fertilizers (DAP) together creates insoluble Zinc Phosphate. Apply at least 10-15 days apart.',
    },
    scientificPrinciple: 'Zn²⁺ + HPO₄²⁻ -> Insoluble Zn₃(PO₄)₂',
  },
  {
    productA: 'High Nitrogen Urea (युरिया)',
    productB: 'Flowering Stage (फुलोरा अवस्था)',
    severity: 'CAUTION',
    reason: {
      mr: 'फुलोऱ्याच्या वेळी जास्त युरिया दिल्यास झाडाची निष्कारण वाढ होते, फुले गळतात आणि बोंडअळी व रसशोषक किडी आकर्षित होतात.',
      hi: 'फूल आने के समय अधिक यूरिया देने से कायिक वृद्धि ज्यादा होती है, फूल गिर जाते हैं और कीटों का प्रकोप बढ़ता है।',
      en: 'Heavy Urea application during peak flowering promotes excessive vegetative succulence, causing flower drop and inviting pest flare-up.',
    },
    scientificPrinciple: 'Excess vegetative growth & Nitrogen-induced flower abscission',
  },
];

// SAMPLE IMAGES FOR DEMO & TESTING
export const SAMPLE_CROP_PHOTOS = [
  {
    id: 'sample_cotton_curling',
    title: { mr: 'कापूस - तुडतुडे व रसशोषक कीड', hi: 'कपास - रस चूसक कीट प्रकोप', en: 'Cotton - Thrips & Jassids Leaf Curling' },
    crop: 'cotton',
    cropStage: 'Vegetative / शाकीय वाढ (४२ दिवस)',
    part: 'leaf',
    badge: 'HIGH CONFIDENCE 🟢',
    description: 'पानांच्या कडा वर वळलेल्या, पिवळसर छटा, खालच्या बाजूला किडींचे अस्तित्व.',
    // Clear SVG image data representing cotton leaf with curling symptoms
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%232e5a27"/><path d="M200 40 C 260 90, 320 150, 300 230 C 270 270, 230 260, 200 280 C 170 260, 130 270, 100 230 C 80 150, 140 90, 200 40 Z" fill="%23689f38"/><path d="M200 40 L200 280 M200 120 L130 90 M200 120 L270 90 M200 170 L110 150 M200 170 L290 150 M200 220 L140 220 M200 220 L260 220" stroke="%238bc34a" stroke-width="4"/><circle cx="130" cy="110" r="16" fill="%23cddc39" opacity="0.8"/><circle cx="270" cy="130" r="20" fill="%23cddc39" opacity="0.8"/><circle cx="210" cy="220" r="14" fill="%23fbc02d" opacity="0.8"/><text x="200" y="295" font-size="14" fill="white" text-anchor="middle" font-weight="bold">Cotton Leaf Sample: Thrips Symptoms</text></svg>',
  },
  {
    id: 'sample_cotton_reddening',
    title: { mr: 'कापूस - मॅग्नेशियम कमतरता (लाल पाने)', hi: 'कपास - मैग्नीशियम कमी (लाल पत्तियां)', en: 'Cotton - Magnesium Deficiency (Red Leaf)' },
    crop: 'cotton',
    cropStage: 'Boll Formation / बोंडे भरणे (८५ दिवस)',
    part: 'leaf',
    badge: 'HIGH CONFIDENCE 🟢',
    description: 'जुन्या पानांच्या शिरांमधील भाग लाल-जांभळा झालेला, शिरा हिरव्या.',
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%231b3815"/><path d="M200 35 C 280 90, 330 160, 310 240 C 260 270, 230 250, 200 280 C 170 250, 140 270, 90 240 C 70 160, 120 90, 200 35 Z" fill="%23b71c1c"/><path d="M200 35 L200 280 M200 110 L120 80 M200 110 L280 80 M200 160 L100 140 M200 160 L300 140 M200 210 L130 210 M200 210 L270 210" stroke="%234caf50" stroke-width="6"/><text x="200" y="295" font-size="14" fill="white" text-anchor="middle" font-weight="bold">Magnesium Deficiency Reddening</text></svg>',
  },
  {
    id: 'sample_ambiguous_leaf',
    title: { mr: 'अस्पष्ट लक्षणे - मध्यम विश्वास (हवामान ताण?)', hi: 'अस्पष्ट लक्षण - मध्यम विश्वास', en: 'Ambiguous Stress - Moderate Confidence' },
    crop: 'cotton',
    cropStage: 'Vegetative',
    part: 'leaf',
    badge: 'MODERATE CONFIDENCE 🟡',
    description: 'थोडे पिवळे पडणे, रासायनिक खतांचा डाग की उष्णतेचा चटका अस्पष्ट.',
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%233e2723"/><path d="M200 45 C 270 95, 310 165, 290 235 C 250 265, 230 250, 200 275 C 170 250, 150 265, 110 235 C 90 165, 130 95, 200 45 Z" fill="%238d6e63"/><circle cx="160" cy="140" r="30" fill="%23ffeb3b" opacity="0.6"/><text x="200" y="295" font-size="14" fill="white" text-anchor="middle" font-weight="bold">Ambiguous Leaf Photo: Needs More Context</text></svg>',
  },
];

// SAMPLE FERTILIZER BAGS
export const SAMPLE_FERTILIZERS = [
  {
    id: 'calcium_nitrate',
    productName: 'Calcium Nitrate (कॅल्शियम नायट्रेट)',
    npk: '15.5-0-0 + 18.8% Ca',
    manufacturer: 'YaraLiva / Mahadhan / GSFC',
    type: 'water_soluble' as const,
    typicalUse: 'Cell wall strength, fruit quality, prevents blossom end rot',
    conflictWith: 'DAP, Single Super Phosphate, Sulphates',
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f5f5f5"/><rect x="50" y="30" width="300" height="240" rx="15" fill="%230277bd"/><text x="200" y="80" fill="white" font-size="22" font-weight="bold" text-anchor="middle">CALCIUM NITRATE</text><text x="200" y="115" fill="%23ffeb3b" font-size="28" font-weight="bold" text-anchor="middle">15.5 : 0 : 0 + 18.8% Ca</text><text x="200" y="150" fill="white" font-size="16" text-anchor="middle">100% Water Soluble Fertilizer</text><rect x="80" y="170" width="240" height="40" rx="6" fill="%23ffffff"/><text x="200" y="196" fill="%2301579b" font-size="16" font-weight="bold" text-anchor="middle">DO NOT MIX WITH DAP / SSP</text><text x="200" y="240" fill="white" font-size="14" text-anchor="middle">Net Weight: 25 kg | FCO Approved</text></svg>',
  },
  {
    id: 'dap_18460',
    productName: 'DAP (डाय-अमोनियम फॉस्फेट)',
    npk: '18 : 46 : 0',
    manufacturer: 'IFFCO / Coromandel / IPL',
    type: 'granular_soil' as const,
    typicalUse: 'Root development, early vegetative boost, basal dose',
    conflictWith: 'Calcium Nitrate, Zinc Sulfate',
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f5f5f5"/><rect x="50" y="30" width="300" height="240" rx="15" fill="%232e7d32"/><text x="200" y="80" fill="white" font-size="24" font-weight="bold" text-anchor="middle">IFFCO D.A.P.</text><text x="200" y="125" fill="%23ffeb3b" font-size="34" font-weight="bold" text-anchor="middle">18 - 46 - 0</text><text x="200" y="160" fill="white" font-size="16" text-anchor="middle">Di-Ammonium Phosphate</text><text x="200" y="235" fill="white" font-size="14" text-anchor="middle">Net Wt: 50 kg | Govt Subsidized</text></svg>',
  },
  {
    id: 'npk_102626',
    productName: 'NPK 10:26:26',
    npk: '10 : 26 : 26',
    manufacturer: 'IFFCO / Mahadhan / Rashtriya Chemicals',
    type: 'granular_soil' as const,
    typicalUse: 'Balanced root and grain development, potassium for pest resistance',
    conflictWith: 'None in soil, standard basal/top dress',
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f5f5f5"/><rect x="50" y="30" width="300" height="240" rx="15" fill="%23ef6c00"/><text x="200" y="80" fill="white" font-size="24" font-weight="bold" text-anchor="middle">MAHADHAN 10:26:26</text><text x="200" y="125" fill="%23ffffff" font-size="34" font-weight="bold" text-anchor="middle">10 - 26 - 26</text><text x="200" y="165" fill="%23ffeb3b" font-size="18" text-anchor="middle">High Phosphorus & Potassium Complex</text><text x="200" y="235" fill="white" font-size="14" text-anchor="middle">Net Wt: 50 kg</text></svg>',
  },
];

// SAMPLE SOIL HEALTH CARDS
export const SAMPLE_SOIL_REPORTS = [
  {
    id: 'black_soil_high_ph',
    title: { mr: 'काळी कसदार जमीन - उच्च सामू (pH 8.3) व कमी कर्ब', hi: 'काली मिट्टी - उच्च पीएच (pH 8.3) व कम कार्बन', en: 'Black Cotton Soil - Alkaline pH 8.3 & Low Carbon' },
    ph: 8.3,
    ec: 0.42,
    oc: 0.38,
    nitrogen: 185,
    phosphorus: 12,
    potassium: 340,
    zinc: 'DEFICIENT',
    summary: {
      mr: 'जमीन क्षारयुक्त (Alkaline) आहे. सेंद्रिय कर्ब खूप कमी (०.३८%) असल्याने खते पिकांना पूर्ण लागत नाहीत. शेणखत किंवा गांडूळ खत देणे अत्यंत गरजेचे आहे.',
      hi: 'मिट्टी क्षारीय (pH 8.3) है। जैविक कार्बन बहुत कम है। रासायनिक खादों का असर बढ़ाने के लिए गोबर की खाद जरूरी है।',
      en: 'Soil is alkaline with low organic carbon (0.38%). Zinc is deficient. Requires 5 tonnes FYM + 20kg Zinc Sulphate.',
    },
  },
  {
    id: 'loamy_balanced',
    title: { mr: 'गाळाची सुपीक जमीन - उत्तम संतुलन (pH 7.1)', hi: 'उपजाऊ दोमट मिट्टी - संतुलित (pH 7.1)', en: 'Fertile Loam Soil - Ideal Balanced (pH 7.1)' },
    ph: 7.1,
    ec: 0.28,
    oc: 0.72,
    nitrogen: 310,
    phosphorus: 22,
    potassium: 260,
    zinc: 'SUFFICIENT',
    summary: {
      mr: 'जमिनीचा सामू व पोषक घटक उत्तम संतुलनात आहेत. सर्व पिकांसाठी अतिशय उपयुक्त.',
      hi: 'मिट्टी की उर्वरता उत्तम है। संतुलित खाद देकर उच्च उत्पादन लिया जा सकता है।',
      en: 'Ideal balanced soil health with good organic carbon and available nutrients.',
    },
  },
];
