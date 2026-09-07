import { Language } from '../types';

export interface TranslationStrings {
  appName: string;
  appSubtitle: string;
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  farmerTitle: string;
  activeField: string;
  switchField: string;
  offlineNotice: string;
  onlineNotice: string;
  readAloud: string;
  stopAudio: string;
  demoTourButton: string;

  // 8 Main Action Buttons
  btnScanCrop: string;
  btnScanCropDesc: string;
  btnCheckFertilizer: string;
  btnCheckFertilizerDesc: string;
  btnCheckSoil: string;
  btnCheckSoilDesc: string;
  btnAskVoice: string;
  btnAskVoiceDesc: string;
  btnMyFarm: string;
  btnMyFarmDesc: string;
  btnWeather: string;
  btnWeatherDesc: string;
  btnCropProblems: string;
  btnCropProblemsDesc: string;
  btnAskExpert: string;
  btnAskExpertDesc: string;

  // Secondary Tools
  btnFarmDiary: string;
  btnCostCalculator: string;

  // New Smart Farm & Livestock Tools
  btnLivestock: string;
  btnLivestockDesc: string;
  btnCalendar: string;
  btnCalendarDesc: string;
  btnFinance: string;
  btnFinanceDesc: string;
  btnInventory: string;
  btnInventoryDesc: string;
  activeAnimal: string;
  switchAnimal: string;
  emergencyAlert: string;

  // Crop Scanner
  cropScanTitle: string;
  selectPhotoType: string;
  partLeaf: string;
  partFruit: string;
  partStem: string;
  partPlant: string;
  partSoil: string;
  takePhoto: string;
  chooseGallery: string;
  useSamplePhoto: string;
  analyzingCrop: string;
  highConfidence: string;
  moderateConfidence: string;
  lowConfidence: string;
  symptomsLabel: string;
  immediateActionLabel: string;
  organicRemedyLabel: string;
  chemicalRemedyLabel: string;
  saveToDiary: string;
  savedToDiarySuccess: string;

  // Fertilizer Scanner
  fertilizerScanTitle: string;
  fertilizerOcrPrompt: string;
  productNameLabel: string;
  npkLabel: string;
  manufacturerLabel: string;
  cropStageLabel: string;
  previousFertilizersLabel: string;
  evaluatingFertilizer: string;
  safeTitle: string;
  needMoreInfoTitle: string;
  doNotRecommendTitle: string;
  compatibilityWarning: string;
  recommendedDoseLabel: string;

  // Soil
  soilTitle: string;
  soilScanPrompt: string;
  soilHealthLabel: string;
  phLabel: string;
  organicCarbonLabel: string;
  nitrogenLabel: string;
  phosphorusLabel: string;
  potassiumLabel: string;
  organicAdviceLabel: string;

  // Voice
  voiceTitle: string;
  voiceListening: string;
  voiceTapToSpeak: string;
  voiceSamplePrompts: string[];

  // General
  back: string;
  close: string;
  save: string;
  cancel: string;
  loading: string;
  error: string;
  retry: string;
}

export const translations: Record<Language, TranslationStrings> = {
  mr: {
    appName: 'किसान मित्र (Farmer Assistant)',
    appSubtitle: 'सोपे व भरवशाचे शेती मार्गदर्शक',
    goodMorning: 'शुभ सकाळ, शेतकरी बंधू',
    goodAfternoon: 'शुभ दुपार, शेतकरी बंधू',
    goodEvening: 'शुभ संध्याकाळ, शेतकरी बंधू',
    farmerTitle: 'शेतकरी',
    activeField: 'सध्याचे शेत',
    switchField: 'शेत बदला',
    offlineNotice: 'इंटरनेट बंद आहे - आधीची माहिती उपलब्ध',
    onlineNotice: 'इंटरनेट चालू आहे',
    readAloud: 'ऐका (आवाज)',
    stopAudio: 'आवाज थांबवा',
    demoTourButton: '३ मिनिटांचे थेट प्रात्यक्षिक (Demo)',

    btnScanCrop: '📸 पिकाचा फोटो तपासा',
    btnScanCropDesc: 'पाने, खोड, फळांवरील रोग व कीड ओळखा',
    btnCheckFertilizer: '🧴 खताची खात्री करा',
    btnCheckFertilizerDesc: 'खताचे पाकीट स्कॅन करा व सुरक्षित मात्रा जाणा',
    btnCheckSoil: '🧪 माती परीक्षण अहवाल',
    btnCheckSoilDesc: 'जमीन आरोग्य पत्रिका सोप्या भाषेत समजून घ्या',
    btnAskVoice: '🎤 बोलून विचारा',
    btnAskVoiceDesc: 'मायक्रोफोन दाबून मराठीत कोणताही प्रश्न विचारा',
    btnMyFarm: '🌱 माझे शेत व पिके',
    btnMyFarmDesc: 'क्षेत्र, पेरणी तारीख व खतांचा हिशोब नोंदवा',
    btnWeather: '🌦️ हवामान व फवारणी सल्ला',
    btnWeatherDesc: 'पाऊस, वारा व फवारणीसाठी योग्य वेळेचा अंदाज',
    btnCropProblems: '🐛 पिकांवरील रोग-कीड कोश',
    btnCropProblemsDesc: 'कापूस, सोयाबीन, कांदा व इतर पिकांचे मार्गदर्शक',
    btnAskExpert: '📞 कृषी तज्ज्ञांशी संपर्क',
    btnAskExpertDesc: 'सरकारी किसान कॉल सेंटर व स्थानिक तज्ज्ञ',

    btnFarmDiary: '📝 शेती दैनंदिनी (डायरी)',
    btnCostCalculator: '💰 खत खर्च कॅल्क्युलेटर',

    btnLivestock: '🐄 गोपालन व पशुधन',
    btnLivestockDesc: 'आरोग्य तपासणी, दुग्ध नोंद, लसीकरण व खाद्य व्यवस्थापन',
    btnCalendar: '📅 शेती कॅलेंडर व कामे',
    btnCalendarDesc: 'पाणी, खते, फवारणी व लसीकरणाच्या आठवणी',
    btnFinance: '💰 शेती हिशोब (खर्च व उत्पन्न)',
    btnFinanceDesc: 'खते, मजुरी, कीटकनाशक खर्च व पीक-दूध विक्री हिशोब',
    btnInventory: '📦 गोदामातील साठा (स्टॉक)',
    btnInventoryDesc: 'शिल्लक खते, बियाणे, औषधे व पशुखाद्य नोंद',
    activeAnimal: 'सध्याचे जनावर',
    switchAnimal: 'जनावर निवडा',
    emergencyAlert: '🚨 तातडीचा पशुवैद्यकीय इशारा',

    cropScanTitle: 'पिकाचा फोटो काढून रोग-कीड तपासा',
    selectPhotoType: 'फोटो कशाचा आहे?',
    partLeaf: 'पान',
    partFruit: 'फळ / बोंड',
    partStem: 'खोड',
    partPlant: 'पूर्ण झाड',
    partSoil: 'माती / मुळे',
    takePhoto: 'कॅमेरा उघडा',
    chooseGallery: 'गॅलरीतून निवडा',
    useSamplePhoto: 'नमुना फोटो वापरून पहा',
    analyzingCrop: 'कृषी वैज्ञानिक तंत्रज्ञानाद्वारे फोटो तपासत आहे...',
    highConfidence: '🟢 खात्रीशीर लक्षणे (उच्च विश्वास)',
    moderateConfidence: '🟡 मध्यम शक्यता (तपशील आवश्यक)',
    lowConfidence: '🔴 कमी विश्वास (तज्ज्ञांची मदत घ्या)',
    symptomsLabel: 'दिसून आलेली लक्षणे:',
    immediateActionLabel: 'तातडीने करावयाची कृती:',
    organicRemedyLabel: '🌱 सेंद्रिय व घरगुती उपाय:',
    chemicalRemedyLabel: '💊 रासायनिक शिफारस (योग्य प्रमाण):',
    saveToDiary: 'शेती डायरीत नोंद करा',
    savedToDiarySuccess: 'नोंद यशस्वीरीत्या शेती डायरीत साठवली गेली!',

    fertilizerScanTitle: 'खताचे पाकीट किंवा नाव तपासा',
    fertilizerOcrPrompt: 'खताच्या पाकिटाचा स्पष्ट फोटो काढा किंवा नाव निवडा',
    productNameLabel: 'खताचे नाव',
    npkLabel: 'एन.पी.के. प्रमाण (NPK)',
    manufacturerLabel: 'उत्पादक कंपनी',
    cropStageLabel: 'पिकाची सद्यस्थिती (अवस्था)',
    previousFertilizersLabel: 'आधी दिलेली खते',
    evaluatingFertilizer: 'वैज्ञानिक नियमांच्या आधारे खताची सुरक्षितता तपासत आहे...',
    safeTitle: 'सुरक्षित व शिफारसीनुसार योग्य',
    needMoreInfoTitle: 'अधिक माहिती आवश्यक',
    doNotRecommendTitle: 'वापर शिफारस करत नाही - धोका संभावतो',
    compatibilityWarning: 'खतांच्या मिश्रणाचा धोका (सुसंगतता चेतावणी):',
    recommendedDoseLabel: 'एकरी शिफारस केलेली मात्रा:',

    soilTitle: 'माती परीक्षण अहवाल (Soil Health Card)',
    soilScanPrompt: 'माती परीक्षण पत्रिकेचा फोटो अपलोड करा किंवा मूल्ये भरा',
    soilHealthLabel: 'जमिनीचे एकूण आरोग्य',
    phLabel: 'सामू (pH - आम्ल/विम्ल)',
    organicCarbonLabel: 'सेंद्रिय कर्ब (Organic Carbon)',
    nitrogenLabel: 'उपलब्ध नत्र (N)',
    phosphorusLabel: 'उपलब्ध स्फुरद (P)',
    potassiumLabel: 'उपलब्ध पालाश (K)',
    organicAdviceLabel: 'जमीन सुधारणेसाठी सेंद्रिय उपाय:',

    voiceTitle: 'कृषी मित्राला बोलून विचारा',
    voiceListening: 'ऐकत आहे... बोला (मराठीत बोला)',
    voiceTapToSpeak: 'मायक्रोफोन बटण दाबून बोला',
    voiceSamplePrompts: [
      'माझ्या कापसाची पाने पिवळी पडत आहेत.',
      'डीएपी दिल्यानंतर कॅल्शियम नायट्रेट लगेच देऊ शकतो का?',
      'सोयाबीनवर चक्रीभुंग्याचा प्रादुर्भाव झाला आहे, काय करावे?',
      'उद्या फवारणी करावी का? पाऊस येईल का?',
    ],

    back: 'मागे',
    close: 'बंद करा',
    save: 'जतन करा',
    cancel: 'रद्द करा',
    loading: 'कृपया थांबा...',
    error: 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.',
    retry: 'पुन्हा प्रयत्न करा',
  },
  hi: {
    appName: 'किसान मित्र (Farmer Assistant)',
    appSubtitle: 'सरल और भरोसेमंद कृषि मार्गदर्शक',
    goodMorning: 'शुभ प्रभात, किसान भाई',
    goodAfternoon: 'नमस्कार, किसान भाई',
    goodEvening: 'शुभ संध्या, किसान भाई',
    farmerTitle: 'किसान',
    activeField: 'सक्रिय खेत',
    switchField: 'खेत बदलें',
    offlineNotice: 'इंटरनेट बंद है - पहले का डेटा उपलब्ध है',
    onlineNotice: 'इंटरनेट चालू है',
    readAloud: 'सुनें (आवाज)',
    stopAudio: 'आवाज रोकें',
    demoTourButton: '३ मिनट का लाइव डेमो (Demo)',

    btnScanCrop: '📸 फसल का फोटो जांचें',
    btnScanCropDesc: 'पत्तियों, तने और फलों के रोग-कीट पहचानें',
    btnCheckFertilizer: '🧴 खाद की पुष्टि करें',
    btnCheckFertilizerDesc: 'खाद का पैकेट स्कैन करें और सुरक्षित मात्रा जानें',
    btnCheckSoil: '🧪 मिट्टी जांच रिपोर्ट',
    btnCheckSoilDesc: 'मृदा स्वास्थ्य पत्रक सरल भाषा में समझें',
    btnAskVoice: '🎤 बोलकर पूछें',
    btnAskVoiceDesc: 'माइक दबाकर हिंदी में कोई भी सवाल पूछें',
    btnMyFarm: '🌱 मेरा खेत और फसलें',
    btnMyFarmDesc: 'रकबा, बुवाई की तारीख व खाद का रिकॉर्ड रखें',
    btnWeather: '🌦️ मौसम और छिड़काव सलाह',
    btnWeatherDesc: 'बारिश, हवा की गति और छिड़काव का सही समय',
    btnCropProblems: '🐛 फसल रोग-कीट ज्ञानकोश',
    btnCropProblemsDesc: 'कपास, सोयाबीन, गेहूं, प्याज आदि का विवरण',
    btnAskExpert: '📞 कृषि विशेषज्ञ से पूछें',
    btnAskExpertDesc: 'सरकारी किसान कॉल सेंटर व विशेषज्ञ सहायता',

    btnFarmDiary: '📝 कृषि डायरी (रिकॉर्ड)',
    btnCostCalculator: '💰 खाद लागत कैलकुलेटर',

    btnLivestock: '🐄 पशुपालन व डेयरी',
    btnLivestockDesc: 'पशु स्वास्थ्य, दूध रिकॉर्ड, टीकाकरण और चारा प्रबंधन',
    btnCalendar: '📅 कृषि कैलेंडर व कार्य',
    btnCalendarDesc: 'सिंचाई, खाद, छिड़काव व टीकाकरण की याद दिलाएं',
    btnFinance: '💰 खेत का हिसाब (खर्च व आय)',
    btnFinanceDesc: 'खाद, मजदूरी खर्च और फसल-दूध बिक्री का पूरा ब्यौरा',
    btnInventory: '📦 गोदाम स्टॉक (सामग्री)',
    btnInventoryDesc: 'बची हुई खाद, बीज, कीटनाशक व पशु आहार का रिकॉर्ड',
    activeAnimal: 'सक्रिय पशु',
    switchAnimal: 'पशु चुनें',
    emergencyAlert: '🚨 आपातकालीन पशु चिकित्सा चेतावनी',

    cropScanTitle: 'फसल की फोटो से रोग और कीट की जांच',
    selectPhotoType: 'फोटो किस भाग का है?',
    partLeaf: 'पत्ती',
    partFruit: 'फल / घंटी',
    partStem: 'तना',
    partPlant: 'पूरा पौधा',
    partSoil: 'मिट्टी / जड़',
    takePhoto: 'कैमरा खोलें',
    chooseGallery: 'गैलरी से चुनें',
    useSamplePhoto: 'नमूना फोटो से जांचें',
    analyzingCrop: 'कृषि विज्ञान आधारित तकनीक से फोटो का विश्लेषण जारी है...',
    highConfidence: '🟢 स्पष्ट लक्षण (उच्च विश्वास)',
    moderateConfidence: '🟡 मध्यम संभावना (अतिरिक्त जानकारी जरूरी)',
    lowConfidence: '🔴 कम विश्वास (विशेषज्ञ से जांच करवाएं)',
    symptomsLabel: 'दिखाई देने वाले लक्षण:',
    immediateActionLabel: 'तुरंत करने योग्य कार्य:',
    organicRemedyLabel: '🌱 जैविक व घरेलू उपाय:',
    chemicalRemedyLabel: '💊 अनुशंसित रासायनिक उपचार (सही मात्रा):',
    saveToDiary: 'कृषि डायरी में दर्ज करें',
    savedToDiarySuccess: 'रिकॉर्ड सफलतापूर्वक कृषि डायरी में सहेजा गया!',

    fertilizerScanTitle: 'खाद का पैकेट या नाम जांचें',
    fertilizerOcrPrompt: 'खाद की बोरी का फोटो खींचें या सूची से चुनें',
    productNameLabel: 'खाद का नाम',
    npkLabel: 'एन.पी.के. अनुपात (NPK)',
    manufacturerLabel: 'निर्माता कंपनी',
    cropStageLabel: 'फसल की वर्तमान अवस्था',
    previousFertilizersLabel: 'पहले दी गई खादें',
    evaluatingFertilizer: 'वैज्ञानिक नियमों के आधार पर सुरक्षा जांच की जा रही है...',
    safeTitle: 'उपयुक्त व अनुशंसित मात्रा',
    needMoreInfoTitle: 'अधिक जानकारी आवश्यक',
    doNotRecommendTitle: 'अनुशंसा नहीं है - नुकसान का खतरा',
    compatibilityWarning: 'खाद मिश्रण की चेतावनी:',
    recommendedDoseLabel: 'प्रति एकड़ अनुशंसित मात्रा:',

    soilTitle: 'मृदा स्वास्थ्य रिपोर्ट (Soil Health Card)',
    soilScanPrompt: 'मिट्टी जांच पत्र की फोटो अपलोड करें या मान दर्ज करें',
    soilHealthLabel: 'मिट्टी का समग्र स्वास्थ्य',
    phLabel: 'पीएच (pH - खारी/अम्लीय)',
    organicCarbonLabel: 'जैविक कार्बन (Organic Carbon)',
    nitrogenLabel: 'उपलब्ध नाइट्रोजन (N)',
    phosphorusLabel: 'उपलब्ध फास्फोरस (P)',
    potassiumLabel: 'उपलब्ध पोटाश (K)',
    organicAdviceLabel: 'मिट्टी सुधार हेतु जैविक सुझाव:',

    voiceTitle: 'किसान मित्र से बोलकर पूछें',
    voiceListening: 'सुन रहे हैं... बोलिए (हिंदी में बोलें)',
    voiceTapToSpeak: 'माइक दबाकर सवाल पूछें',
    voiceSamplePrompts: [
      'मेरे कपास के पत्ते पीले पड़ रहे हैं, क्या करूं?',
      'डीएपी और यूरिया क्या एक साथ दे सकते हैं?',
      'सोयाबीन में पीला मोजेक वायरस दिख रहा है।',
      'क्या आज कीटनाशक का छिड़काव करना सुरक्षित है?',
    ],

    back: 'पीछे',
    close: 'बंद करें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    loading: 'कृपया प्रतीक्षा करें...',
    error: 'कोई त्रुटि हुई। कृपया पुनः प्रयास करें।',
    retry: 'पुनः प्रयास करें',
  },
  en: {
    appName: 'Farmer Assistant (Kisan Mitra)',
    appSubtitle: 'Simple & Trustworthy Farming Guide',
    goodMorning: 'Good morning, Farmer Friend',
    goodAfternoon: 'Good afternoon, Farmer Friend',
    goodEvening: 'Good evening, Farmer Friend',
    farmerTitle: 'Farmer',
    activeField: 'Active Field',
    switchField: 'Switch Field',
    offlineNotice: 'Offline Mode - Cached Data Available',
    onlineNotice: 'Online & Connected',
    readAloud: 'Read Aloud (Voice)',
    stopAudio: 'Stop Audio',
    demoTourButton: '3-Minute Live Demo Tour',

    btnScanCrop: '📸 Scan My Crop',
    btnScanCropDesc: 'Identify pests, leaf spots & deficiencies',
    btnCheckFertilizer: '🧴 Check Fertilizer',
    btnCheckFertilizerDesc: 'OCR bag scan, safe dose & compatibility check',
    btnCheckSoil: '🧪 Check My Soil',
    btnCheckSoilDesc: 'Convert Soil Health Card into simple local advice',
    btnAskVoice: '🎤 Ask by Voice',
    btnAskVoiceDesc: 'Speak in Marathi, Hindi, or English naturally',
    btnMyFarm: '🌱 My Farm & Crops',
    btnMyFarmDesc: 'Fields, acreage, sowing dates & fertilizer history',
    btnWeather: '🌦️ Weather & Advisories',
    btnWeatherDesc: 'Rain alerts, wind speed & spraying window',
    btnCropProblems: '🐛 Crop Problems Library',
    btnCropProblemsDesc: 'Guide for Cotton, Soybean, Onion, Wheat, etc.',
    btnAskExpert: '📞 Ask an Expert',
    btnAskExpertDesc: 'Kisan Call Center & local KVK scientists',

    btnFarmDiary: '📝 Farm Diary (Logs)',
    btnCostCalculator: '💰 Fertilizer Cost Calculator',

    btnLivestock: '🐄 Cattle & Livestock',
    btnLivestockDesc: 'Animal health, milk records, vaccination & feed care',
    btnCalendar: '📅 Farm Calendar & Tasks',
    btnCalendarDesc: 'Watering, fertilizer, spray & vaccination reminders',
    btnFinance: '💰 Farm Finance (Profit & Loss)',
    btnFinanceDesc: 'Track fertilizer, labour costs & crop/milk income',
    btnInventory: '📦 Farm Stock (Inventory)',
    btnInventoryDesc: 'Remaining fertilizers, seeds, pesticides & animal feed',
    activeAnimal: 'Active Animal',
    switchAnimal: 'Switch Animal',
    emergencyAlert: '🚨 Veterinary Emergency Alert',

    cropScanTitle: 'Scan Crop Photo for Issues',
    selectPhotoType: 'What part is photographed?',
    partLeaf: 'Leaf',
    partFruit: 'Fruit / Boll',
    partStem: 'Stem',
    partPlant: 'Whole Plant',
    partSoil: 'Soil / Root',
    takePhoto: 'Take Photo',
    chooseGallery: 'Choose from Gallery',
    useSamplePhoto: 'Try with Sample Photo',
    analyzingCrop: 'Analyzing with verified agricultural vision models...',
    highConfidence: '🟢 High Confidence (Clear symptoms)',
    moderateConfidence: '🟡 Moderate Confidence (More info needed)',
    lowConfidence: '🔴 Low Confidence (Expert verification advised)',
    symptomsLabel: 'Observed Symptoms:',
    immediateActionLabel: 'Immediate Action Required:',
    organicRemedyLabel: '🌱 Organic & Cultural Remedies:',
    chemicalRemedyLabel: '💊 Recommended Chemical Treatment (Exact dose):',
    saveToDiary: 'Save to Farm Diary',
    savedToDiarySuccess: 'Successfully saved to Farm Diary!',

    fertilizerScanTitle: 'Check Fertilizer Bag or Label',
    fertilizerOcrPrompt: 'Photograph the fertilizer bag or select from list',
    productNameLabel: 'Product Name',
    npkLabel: 'NPK Ratio',
    manufacturerLabel: 'Manufacturer',
    cropStageLabel: 'Current Crop Growth Stage',
    previousFertilizersLabel: 'Previously Applied Fertilizers',
    evaluatingFertilizer: 'Evaluating safety against agronomic rules...',
    safeTitle: 'Appropriate & Safe Based on Science',
    needMoreInfoTitle: 'Need More Information',
    doNotRecommendTitle: 'Do Not Recommend - Incompatibility Detected',
    compatibilityWarning: 'Fertilizer Compatibility Warning:',
    recommendedDoseLabel: 'Recommended Dose per Acre:',

    soilTitle: 'Soil Test Report Reader',
    soilScanPrompt: 'Upload a Soil Health Card photo or enter values',
    soilHealthLabel: 'Overall Soil Health Status',
    phLabel: 'Soil pH',
    organicCarbonLabel: 'Organic Carbon (OC)',
    nitrogenLabel: 'Available Nitrogen (N)',
    phosphorusLabel: 'Available Phosphorus (P)',
    potassiumLabel: 'Available Potassium (K)',
    organicAdviceLabel: 'Organic Amendments to Improve Soil:',

    voiceTitle: 'Ask Kisan Mitra by Voice',
    voiceListening: 'Listening... Please speak your question',
    voiceTapToSpeak: 'Tap microphone and ask anything',
    voiceSamplePrompts: [
      'My cotton leaves are turning red and curling.',
      'Can I apply Calcium Nitrate after DAP?',
      'How to control stem fly in soybean?',
      'Is it safe to spray insecticide today with this weather?',
    ],

    back: 'Back',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Please wait...',
    error: 'An error occurred. Please try again.',
    retry: 'Try Again',
  },
};
