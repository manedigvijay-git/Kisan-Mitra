export interface VillageInfo {
  nameMr: string;
  nameEn: string;
}

export interface TalukaInfo {
  id: string;
  nameMr: string;
  nameEn: string;
  aliases?: string[];
  villages: VillageInfo[];
}

export interface DistrictInfo {
  id: string;
  nameMr: string;
  nameEn: string;
  aliases?: string[];
  talukas: TalukaInfo[];
}

export const MAHARASHTRA_DISTRICTS: DistrictInfo[] = [
  {
    id: 'pune',
    nameMr: 'पुणे (Pune)',
    nameEn: 'Pune',
    aliases: ['Poona'],
    talukas: [
      { id: 'pune_city', nameMr: 'पुणे शहर (Pune City)', nameEn: 'Pune City', villages: [{ nameMr: 'शिवाजीनगर', nameEn: 'Shivajinagar' }, { nameMr: 'कोथरूड', nameEn: 'Kothrud' }, { nameMr: 'हडपसर', nameEn: 'Hadapsar' }] },
      { id: 'haveli', nameMr: 'हवेली (Haveli)', nameEn: 'Haveli', villages: [{ nameMr: 'वाघोली', nameEn: 'Wagholi' }, { nameMr: 'खडकवासला', nameEn: 'Khadakwasla' }, { nameMr: 'उरुळी कांचन', nameEn: 'Uruli Kanchan' }, { nameMr: 'लोणी काळभोर', nameEn: 'Loni Kalbhor' }] },
      { id: 'baramati', nameMr: 'बारामती (Baramati)', nameEn: 'Baramati', villages: [{ nameMr: 'माळेगाव', nameEn: 'Malegaon' }, { nameMr: 'सुपे', nameEn: 'Supe' }, { nameMr: 'मेखळी', nameEn: 'Mekhali' }, { nameMr: 'मोरगाव', nameEn: 'Morgaon' }] },
      { id: 'shirur', nameMr: 'शिरूर (Shirur)', nameEn: 'Shirur', villages: [{ nameMr: 'रांजणगाव', nameEn: 'Ranjangaon' }, { nameMr: 'शिक्रापूर', nameEn: 'Shikrapur' }, { nameMr: 'तळेगाव ढमढेरे', nameEn: 'Talegaon Dhamdhere' }] },
      { id: 'khed', nameMr: 'खेड - राजगुरुनगर (Khed)', nameEn: 'Khed', aliases: ['Rajgurunagar'], villages: [{ nameMr: 'राजगुरुनगर', nameEn: 'Rajgurunagar' }, { nameMr: 'चाकण', nameEn: 'Chakan' }, { nameMr: 'आळंदी', nameEn: 'Alandi' }] },
      { id: 'ambegaon', nameMr: 'आंबेगाव (Ambegaon)', nameEn: 'Ambegaon', villages: [{ nameMr: 'घोडेगाव', nameEn: 'Ghodegaon' }, { nameMr: 'मंचर', nameEn: 'Manchar' }, { nameMr: 'डिंभे', nameEn: 'Dimbhe' }] },
      { id: 'junnar', nameMr: 'जुन्नर (Junnar)', nameEn: 'Junnar', villages: [{ nameMr: 'ओतूर', nameEn: 'Otur' }, { nameMr: 'नारायणगाव', nameEn: 'Narayangaon' }, { nameMr: 'आळेफाटा', nameEn: 'Alephata' }] },
      { id: 'daund', nameMr: 'दौंड (Daund)', nameEn: 'Daund', villages: [{ nameMr: 'पाटस', nameEn: 'Patas' }, { nameMr: 'केडगाव', nameEn: 'Kedgaon' }, { nameMr: 'यवत', nameEn: 'Yawat' }] },
      { id: 'indapur', nameMr: 'इंदापूर (Indapur)', nameEn: 'Indapur', villages: [{ nameMr: 'भिगवण', nameEn: 'Bhigwan' }, { nameMr: 'बावडा', nameEn: 'Bawada' }, { nameMr: 'काटी', nameEn: 'Kati' }] },
      { id: 'purandar', nameMr: 'पुरंदर - सासवड (Purandar)', nameEn: 'Purandar', aliases: ['Saswad'], villages: [{ nameMr: 'सासवड', nameEn: 'Saswad' }, { nameMr: 'जेजुरी', nameEn: 'Jejuri' }, { nameMr: 'गव्हणेवाडी', nameEn: 'Ghavanewadi' }] },
      { id: 'bhor', nameMr: 'भोर (Bhor)', nameEn: 'Bhor', villages: [{ nameMr: 'नसरापूर', nameEn: 'Nasrapur' }, { nameMr: 'शिरवळ', nameEn: 'Shirwal' }] },
      { id: 'velhe', nameMr: 'वेल्हे (Velhe)', nameEn: 'Velhe', aliases: ['Rajgad'], villages: [{ nameMr: 'वेल्हे', nameEn: 'Velhe' }, { nameMr: 'पानशेत', nameEn: 'Panshet' }] },
      { id: 'mulshi', nameMr: 'मुळशी (Mulshi)', nameEn: 'Mulshi', aliases: ['Paud'], villages: [{ nameMr: 'पौड', nameEn: 'Paud' }, { nameMr: 'पिरंगुट', nameEn: 'Pirangut' }, { nameMr: 'हिंजवडी', nameEn: 'Hinjawadi' }] },
      { id: 'maval', nameMr: 'मावळ (Maval)', nameEn: 'Maval', aliases: ['Lonavala'], villages: [{ nameMr: 'तळेगाव दाभाडे', nameEn: 'Talegaon Dabhade' }, { nameMr: 'लोणावळा', nameEn: 'Lonavala' }, { nameMr: 'वडगाव मावळ', nameEn: 'Vadgaon Maval' }] },
    ]
  },
  {
    id: 'satara',
    nameMr: 'सातारा (Satara)',
    nameEn: 'Satara',
    talukas: [
      { id: 'satara_t', nameMr: 'सातारा (Satara)', nameEn: 'Satara', villages: [{ nameMr: 'शेंद्रे', nameEn: 'Shendre' }, { nameMr: 'लिंब', nameEn: 'Limb' }, { nameMr: 'नागठाणे', nameEn: 'Nagthane' }, { nameMr: 'परळी', nameEn: 'Parali' }] },
      { id: 'karad', nameMr: 'कराड (Karad)', nameEn: 'Karad', villages: [{ nameMr: 'मलकापूर', nameEn: 'Malkapur' }, { nameMr: 'उंब्रज', nameEn: 'Umbraj' }, { nameMr: 'सहेलापूर', nameEn: 'Sahelapur' }, { nameMr: 'तांबवे', nameEn: 'Tambave' }, { nameMr: 'मसूर', nameEn: 'Masur' }] },
      { id: 'wai', nameMr: 'वाई (Wai)', nameEn: 'Wai', villages: [{ nameMr: 'भुईंज', nameEn: 'Bhuinj' }, { nameMr: 'ओझर्डे', nameEn: 'Ozarde' }, { nameMr: 'सुरुूर', nameEn: 'Surur' }] },
      { id: 'phaltan', nameMr: 'फलटण (Phaltan)', nameEn: 'Phaltan', villages: [{ nameMr: 'तरडगाव', nameEn: 'Taradgaon' }, { nameMr: 'निंबळक', nameEn: 'Nimbalak' }, { nameMr: 'गिरवी', nameEn: 'Girvi' }, { nameMr: 'विडणी', nameEn: 'Vidani' }] },
      { id: 'man', nameMr: 'माण - दहीवडी (Man)', nameEn: 'Man', aliases: ['Dahiwadi'], villages: [{ nameMr: 'दहीवडी', nameEn: 'Dahiwadi' }, { nameMr: 'म्हसवड', nameEn: 'Mhaswad' }, { nameMr: 'शिंगणापूर', nameEn: 'Shingnapur' }] },
      { id: 'khatav', nameMr: 'खटाव - वडूज (Khatav)', nameEn: 'Khatav', aliases: ['Vaduj'], villages: [{ nameMr: 'वडूज', nameEn: 'Vaduj' }, { nameMr: 'औंध', nameEn: 'Aundh' }, { nameMr: 'मयणी', nameEn: 'Mayani' }, { nameMr: 'पुसेगाव', nameEn: 'Pusegaon' }] },
      { id: 'mahabaleshwar', nameMr: 'महाबळेश्वर (Mahabaleshwar)', nameEn: 'Mahabaleshwar', villages: [{ nameMr: 'पाचगणी', nameEn: 'Panchgani' }, { nameMr: 'तापोळा', nameEn: 'Tapola' }] },
      { id: 'jaoli', nameMr: 'जावळी - मेढा (Jaoli)', nameEn: 'Jaoli', aliases: ['Medha'], villages: [{ nameMr: 'मेढा', nameEn: 'Medha' }, { nameMr: 'कुडाळ', nameEn: 'Kudal' }] },
      { id: 'koregaon', nameMr: 'कोरेगाव (Koregaon)', nameEn: 'Koregaon', villages: [{ nameMr: 'रहिमपूर', nameEn: 'Rahimpur' }, { nameMr: 'वाठार स्टेशन', nameEn: 'Wathar Station' }, { nameMr: 'ल्हासुर्णे', nameEn: 'Lhasurne' }] },
      { id: 'patan', nameMr: 'पाटण (Patan)', nameEn: 'Patan', villages: [{ nameMr: 'मल्हारपेठ', nameEn: 'Malharpeth' }, { nameMr: 'हेळवाक', nameEn: 'Helwak' }, { nameMr: 'तारळे', nameEn: 'Tarale' }] },
      { id: 'khandala', nameMr: 'खंडाळा (Khandala)', nameEn: 'Khandala', villages: [{ nameMr: 'शिरवळ', nameEn: 'Shirwal' }, { nameMr: 'लोणंद', nameEn: 'Lonand' }, { nameMr: 'पारगाव', nameEn: 'Pargaon' }] },
    ]
  },
  {
    id: 'sangli',
    nameMr: 'सांगली (Sangli)',
    nameEn: 'Sangli',
    talukas: [
      { id: 'miraj', nameMr: 'मिरज (Miraj)', nameEn: 'Miraj', villages: [{ nameMr: 'समडोळी', nameEn: 'Samdoli' }, { nameMr: 'सोनलगी', nameEn: 'Sonalgi' }, { nameMr: 'कुपवाड', nameEn: 'Kupwad' }] },
      { id: 'tasgaon', nameMr: 'तासगाव (Tasgaon)', nameEn: 'Tasgaon', villages: [{ nameMr: 'मनेराजुरी', nameEn: 'Manerajuri' }, { nameMr: 'सावळज', nameEn: 'Sawalaj' }, { nameMr: 'विसापूर', nameEn: 'Visapur' }] },
      { id: 'khanapur', nameMr: 'खानापूर - विटा (Khanapur)', nameEn: 'Khanapur', aliases: ['Vita'], villages: [{ nameMr: 'विटा', nameEn: 'Vita' }, { nameMr: 'भाळवणी', nameEn: 'Bhalwani' }] },
      { id: 'palus', nameMr: 'पलूस (Palus)', nameEn: 'Palus', villages: [{ nameMr: 'बुरुंगवाडी', nameEn: 'Burungwadi' }, { nameMr: 'तुपारी', nameEn: 'Tupari' }] },
      { id: 'walwa', nameMr: 'वाळवा - इस्लामपूर (Walwa)', nameEn: 'Walwa', aliases: ['Islampur'], villages: [{ nameMr: 'इस्लामपूर', nameEn: 'Islampur' }, { nameMr: 'पेठ', nameEn: 'Peth' }, { nameMr: 'कासेगाव', nameEn: 'Kasegaon' }] },
      { id: 'shirala', nameMr: 'शिराळा (Shirala)', nameEn: 'Shirala', villages: [{ nameMr: 'मांगले', nameEn: 'Mangle' }, { nameMr: 'चरण', nameEn: 'Charan' }] },
      { id: 'atpadi', nameMr: 'आटपाडी (Atpadi)', nameEn: 'Atpadi', villages: [{ nameMr: 'खरसूट', nameEn: 'Kharsundi' }, { nameMr: 'दिघंची', nameEn: 'Dighanchi' }] },
      { id: 'jath', nameMr: 'जत (Jath)', nameEn: 'Jath', villages: [{ nameMr: 'उमडी', nameEn: 'Umadi' }, { nameMr: 'डफळापूर', nameEn: 'Dafalapur' }] },
      { id: 'kavathe_mahankal', nameMr: 'कवठे महांकाळ (Kavathe Mahankal)', nameEn: 'Kavathe Mahankal', villages: [{ nameMr: 'कुचाळी', nameEn: 'Kuchali' }, { nameMr: 'नागज', nameEn: 'Nagaj' }] },
      { id: 'kadegaon', nameMr: 'कडेगाव (Kadegaon)', nameEn: 'Kadegaon', villages: [{ nameMr: 'चिंचणी', nameEn: 'Chinchani' }, { nameMr: 'सोहळा', nameEn: 'Sohala' }] },
    ]
  },
  {
    id: 'kolhapur',
    nameMr: 'कोल्हापूर (Kolhapur)',
    nameEn: 'Kolhapur',
    talukas: [
      { id: 'karveer', nameMr: 'करवीर (Karveer)', nameEn: 'Karveer', villages: [{ nameMr: 'वडणगे', nameEn: 'Wadange' }, { nameMr: 'पाचगाव', nameEn: 'Pachgaon' }, { nameMr: 'उजळाईवाडी', nameEn: 'Ujalaiwadi' }] },
      { id: 'kagal', nameMr: 'कागल (Kagal)', nameEn: 'Kagal', villages: [{ nameMr: 'सेनापती कापशी', nameEn: 'Senapati Kapashi' }, { nameMr: 'मुरगूड', nameEn: 'Murgud' }] },
      { id: 'hatkanangle', nameMr: 'हातकणंगले (Hatkanangle)', nameEn: 'Hatkanangle', villages: [{ nameMr: 'इचलकरंजी', nameEn: 'Ichalkaranji' }, { nameMr: 'हुपरी', nameEn: 'Hupari' }, { nameMr: 'शिरोली', nameEn: 'Shiroli' }] },
      { id: 'shirol', nameMr: 'शिरोळ (Shirol)', nameEn: 'Shirol', villages: [{ nameMr: 'जयसिंगपूर', nameEn: 'Jaysingpur' }, { nameMr: 'नृसिंहवाडी', nameEn: 'Narsobawadi' }, { nameMr: 'कुरुंदवाड', nameEn: 'Kurundwad' }] },
      { id: 'radhanagari', nameMr: 'राधानगरी (Radhanagari)', nameEn: 'Radhanagari', villages: [{ nameMr: 'फेजीवडे', nameEn: 'Fejivade' }, { nameMr: 'भोगावती', nameEn: 'Bhogawati' }] },
      { id: 'bhudargad', nameMr: 'भुदरगड - गारगोटी (Bhudargad)', nameEn: 'Bhudargad', aliases: ['Gargoti'], villages: [{ nameMr: 'गारगोटी', nameEn: 'Gargoti' }, { nameMr: 'कदगाव', nameEn: 'Kadgaon' }] },
      { id: 'ajara', nameMr: 'आजरा (Ajara)', nameEn: 'Ajara', villages: [{ nameMr: 'उत्तूर', nameEn: 'Uttur' }, { nameMr: 'मडिलगे', nameEn: 'Madilage' }] },
      { id: 'chandgad', nameMr: 'चंदगड (Chandgad)', nameEn: 'Chandgad', villages: [{ nameMr: 'तुर्केवाडी', nameEn: 'Turkewadi' }, { nameMr: 'हेव्हाळे', nameEn: 'Hevale' }] },
      { id: 'gadhinglaj', nameMr: 'गडहिंग्लज (Gadhinglaj)', nameEn: 'Gadhinglaj', villages: [{ nameMr: 'महागाव', nameEn: 'Mahagaon' }, { nameMr: 'नेसरी', nameEn: 'Nesari' }] },
      { id: 'shahuwadi', nameMr: 'शाहूवाडी (Shahuwadi)', nameEn: 'Shahuwadi', villages: [{ nameMr: 'मलकापूर', nameEn: 'Malkapur' }, { nameMr: 'बांबवडे', nameEn: 'Bambavade' }] },
      { id: 'panhala', nameMr: 'पन्हाळा (Panhala)', nameEn: 'Panhala', villages: [{ nameMr: 'कोडोली', nameEn: 'Kodoli' }, { nameMr: 'पोर्ले', nameEn: 'Porle' }] },
      { id: 'gaganbawada', nameMr: 'गगनबावडा (Gaganbawada)', nameEn: 'Gaganbawada', villages: [{ nameMr: 'बावडा', nameEn: 'Bawada' }, { nameMr: 'वेसर्डे', nameEn: 'Vesarde' }] },
    ]
  },
  {
    id: 'solapur',
    nameMr: 'सोलापूर (Solapur)',
    nameEn: 'Solapur',
    talukas: [
      { id: 'north_solapur', nameMr: 'उत्तर सोलापूर (North Solapur)', nameEn: 'North Solapur', villages: [{ nameMr: 'नांदणी', nameEn: 'Nandani' }, { nameMr: 'शेगाव', nameEn: 'Shegaon' }] },
      { id: 'south_solapur', nameMr: 'दक्षिण सोलापूर (South Solapur)', nameEn: 'South Solapur', villages: [{ nameMr: 'मंद्रुप', nameEn: 'Mandrup' }, { nameMr: 'होटगी', nameEn: 'Hotgi' }] },
      { id: 'barshi', nameMr: 'बार्शी (Barshi)', nameEn: 'Barshi', villages: [{ nameMr: 'वैराग', nameEn: 'Vairag' }, { nameMr: 'पांगरी', nameEn: 'Pangri' }] },
      { id: 'akkalkot', nameMr: 'अक्कलकोट (Akkalkot)', nameEn: 'Akkalkot', villages: [{ nameMr: 'मैंदर्गी', nameEn: 'Maindargi' }, { nameMr: 'वाघदडी', nameEn: 'Waghdadi' }] },
      { id: 'mohol', nameMr: 'मोहोळ (Mohol)', nameEn: 'Mohol', villages: [{ nameMr: 'पेनूर', nameEn: 'Penur' }, { nameMr: 'कामती', nameEn: 'Kamati' }] },
      { id: 'pandharpur', nameMr: 'पंढरपूर (Pandharpur)', nameEn: 'Pandharpur', villages: [{ nameMr: 'भाळवणी', nameEn: 'Bhalwani' }, { nameMr: 'करकंब', nameEn: 'Karkamb' }, { nameMr: 'तळसंगी', nameEn: 'Talasangi' }] },
      { id: 'sangola', nameMr: 'सांगोला (Sangola)', nameEn: 'Sangola', villages: [{ nameMr: 'महूद', nameEn: 'Mahud' }, { nameMr: 'जवळा', nameEn: 'Jawala' }] },
      { id: 'malshiras', nameMr: 'माळशिरस (Malshiras)', nameEn: 'Malshiras', villages: [{ nameMr: 'अकलूज', nameEn: 'Akluj' }, { nameMr: 'नातेपुते', nameEn: 'Natepute' }, { nameMr: 'सदाशिवनगर', nameEn: 'Sadashivnagar' }] },
      { id: 'mangalwedha', nameMr: 'मंगळवेढा (Mangalwedha)', nameEn: 'Mangalwedha', villages: [{ nameMr: 'भोसे', nameEn: 'Bhose' }, { nameMr: 'मरवडे', nameEn: 'Marwade' }] },
      { id: 'karmala', nameMr: 'करमाळा (Karmala)', nameEn: 'Karmala', villages: [{ nameMr: 'जेऊर', nameEn: 'Jeur' }, { nameMr: 'केम', nameEn: 'Kem' }] },
      { id: 'madha', nameMr: 'माढा (Madha)', nameEn: 'Madha', villages: [{ nameMr: 'कुर्डुवाडी', nameEn: 'Kurduwadi' }, { nameMr: 'टेंभुर्णी', nameEn: 'Tembhurni' }] },
    ]
  },
  {
    id: 'nashik',
    nameMr: 'नाशिक (Nashik)',
    nameEn: 'Nashik',
    talukas: [
      { id: 'nashik_t', nameMr: 'नाशिक (Nashik)', nameEn: 'Nashik', villages: [{ nameMr: 'सातपूर', nameEn: 'Satpur' }, { nameMr: 'देवळाली', nameEn: 'Deolali' }, { nameMr: 'भगूर', nameEn: 'Bhagur' }] },
      { id: 'malegaon', nameMr: 'मालेगाव (Malegaon)', nameEn: 'Malegaon', villages: [{ nameMr: 'दाभाडी', nameEn: 'Dabhadi' }, { nameMr: 'सौंदाणे', nameEn: 'Saundane' }] },
      { id: 'sinnar', nameMr: 'सिन्नर (Sinnar)', nameEn: 'Sinnar', villages: [{ nameMr: 'मुसळगाव', nameEn: 'Musalgaon' }, { nameMr: 'पाटोदा', nameEn: 'Patoda' }, { nameMr: 'वावी', nameEn: 'Wavi' }] },
      { id: 'igatpuri', nameMr: 'इगतपुरी (Igatpuri)', nameEn: 'Igatpuri', villages: [{ nameMr: 'घोटी', nameEn: 'Ghoti' }, { nameMr: 'टाकेद', nameEn: 'Taked' }] },
      { id: 'dindori', nameMr: 'दिंडोरी (Dindori)', nameEn: 'Dindori', villages: [{ nameMr: 'वणी', nameEn: 'Wani' }, { nameMr: 'वरखेडा', nameEn: 'Varkheda' }] },
      { id: 'niphad', nameMr: 'निफाड (Niphad)', nameEn: 'Niphad', villages: [{ nameMr: 'पिंपळगाव बसवंत', nameEn: 'Pimpalgaon Baswant' }, { nameMr: 'लासलगाव', nameEn: 'Lasalgaon' }, { nameMr: 'ओझर', nameEn: 'Ozar' }] },
      { id: 'yeola', nameMr: 'येवला (Yeola)', nameEn: 'Yeola', villages: [{ nameMr: 'अंदरसूल', nameEn: 'Andarsul' }, { nameMr: 'नगरसूल', nameEn: 'Nagarsul' }] },
      { id: 'nandgaon', nameMr: 'नांदगाव (Nandgaon)', nameEn: 'Nandgaon', villages: [{ nameMr: 'मनमाड', nameEn: 'Manmad' }, { nameMr: 'न्यायडोंगंगरी', nameEn: 'Nyaydongri' }] },
      { id: 'chandwad', nameMr: 'चांदवड (Chandwad)', nameEn: 'Chandwad', villages: [{ nameMr: 'राहुड', nameEn: 'Rahud' }, { nameMr: 'वडनेर भैरव', nameEn: 'Vadner Bhairao' }] },
      { id: 'kalwan', nameMr: 'कलवण (Kalwan)', nameEn: 'Kalwan', villages: [{ nameMr: 'अभिजित', nameEn: 'Abhijit' }, { nameMr: 'मानूर', nameEn: 'Manur' }] },
      { id: 'baglan', nameMr: 'बागलाण - सटाणा (Baglan)', nameEn: 'Baglan', aliases: ['Satana'], villages: [{ nameMr: 'सटाणा', nameEn: 'Satana' }, { nameMr: 'नामपूर', nameEn: 'Nampur' }] },
      { id: 'surgana', nameMr: 'सुरगाणा (Surgana)', nameEn: 'Surgana', villages: [{ nameMr: 'उंब Than', nameEn: 'Umbathan' }, { nameMr: 'बोरगाव', nameEn: 'Borgaon' }] },
      { id: 'peint', nameMr: 'पेठ (Peint)', nameEn: 'Peint', villages: [{ nameMr: 'करंजळी', nameEn: 'Karanjali' }, { nameMr: 'कोहंडोळ', nameEn: 'Kohandol' }] },
      { id: 'trimbakeshwar', nameMr: 'त्रिंबकेश्वर (Trimbakeshwar)', nameEn: 'Trimbakeshwar', villages: [{ nameMr: 'अंजनेरी', nameEn: 'Anjaneri' }, { nameMr: 'पहरज', nameEn: 'Paharaj' }] },
      { id: 'deola', nameMr: 'देवळा (Deola)', nameEn: 'Deola', villages: [{ nameMr: 'उमराणे', nameEn: 'Umrane' }, { nameMr: 'लोहणेर', nameEn: 'Lohner' }] },
    ]
  },
  {
    id: 'ahilyanagar',
    nameMr: 'अहिल्यानगर / अहमदनगर (Ahilyanagar / Ahmednagar)',
    nameEn: 'Ahilyanagar',
    aliases: ['Ahmednagar', 'Nagar'],
    talukas: [
      { id: 'nagar_t', nameMr: 'नगर (Nagar)', nameEn: 'Nagar', villages: [{ nameMr: 'चास', nameEn: 'Chas' }, { nameMr: 'केडगाव', nameEn: 'Kedgaon' }, { nameMr: 'नागापूर', nameEn: 'Nagapur' }] },
      { id: 'rahuri', nameMr: 'राहुरी (Rahuri)', nameEn: 'Rahuri', villages: [{ nameMr: 'देवळाली प्रवरा', nameEn: 'Deolali Pravara' }, { nameMr: 'वांबोरी', nameEn: 'Vambori' }, { nameMr: 'तळवडे', nameEn: 'Talawade' }] },
      { id: 'shrirampur', nameMr: 'श्रीरामपूर (Shrirampur)', nameEn: 'Shrirampur', villages: [{ nameMr: 'बेलापूर', nameEn: 'Belapur' }, { nameMr: 'टाकळीभान', nameEn: 'Taklibhan' }] },
      { id: 'sangamner', nameMr: 'संगमनेर (Sangamner)', nameEn: 'Sangamner', villages: [{ nameMr: 'धांदरफळ', nameEn: 'Dhandarphal' }, { nameMr: 'घारगाव', nameEn: 'Ghargaon' }, { nameMr: 'तळेगाव', nameEn: 'Talegaon' }] },
      { id: 'akole', nameMr: 'अकोले (Akole)', nameEn: 'Akole', villages: [{ nameMr: 'राजूर', nameEn: 'Rajur' }, { nameMr: 'समशेरपूर', nameEn: 'Samsherpur' }] },
      { id: 'kopargaon', nameMr: 'कोपरगाव (Kopargaon)', nameEn: 'Kopargaon', villages: [{ nameMr: 'पोहेगाव', nameEn: 'Pohegaon' }, { nameMr: 'शिर्डी जवळ', nameEn: 'Near Shirdi' }] },
      { id: 'rahata', nameMr: 'राहाता (Rahata)', nameEn: 'Rahata', villages: [{ nameMr: 'शिर्डी', nameEn: 'Shirdi' }, { nameMr: 'लोणी', nameEn: 'Loni' }] },
      { id: 'nevasa', nameMr: 'नेवासा (Nevasa)', nameEn: 'Nevasa', villages: [{ nameMr: 'कुकाणा', nameEn: 'Kukana' }, { nameMr: 'घोडेगाव', nameEn: 'Ghodegaon' }, { nameMr: 'शनिशिंगणापूर', nameEn: 'Shani Shingnapur' }] },
      { id: 'shevgaon', nameMr: 'शेवगाव (Shevgaon)', nameEn: 'Shevgaon', villages: [{ nameMr: 'बोधेगाव', nameEn: 'Bodhegaon' }, { nameMr: 'तांदुळवाडी', nameEn: 'Tandulwadi' }] },
      { id: 'pathardi', nameMr: 'पाथर्डी (Pathardi)', nameEn: 'Pathardi', villages: [{ nameMr: 'तिसगाव', nameEn: 'Tisgaon' }, { nameMr: 'माणिकदौंडी', nameEn: 'Manikdaundi' }] },
      { id: 'jamkhed', nameMr: 'जामखेड (Jamkhed)', nameEn: 'Jamkhed', villages: [{ nameMr: 'खर्डा', nameEn: 'Kharda' }, { nameMr: 'सावरगाव', nameEn: 'Savargaon' }] },
      { id: 'karjat_ah', nameMr: 'कर्जत (Karjat)', nameEn: 'Karjat', villages: [{ nameMr: 'राशीन', nameEn: 'Rashin' }, { nameMr: 'मिरजगाव', nameEn: 'Mirajgaon' }] },
      { id: 'shrigonda', nameMr: 'श्रीगोंदा (Shrigonda)', nameEn: 'Shrigonda', villages: [{ nameMr: 'बेलवंडी', nameEn: 'Belwandi' }, { nameMr: 'काष्टी', nameEn: 'Kashti' }] },
      { id: 'parner', nameMr: 'पारनेर (Parner)', nameEn: 'Parner', villages: [{ nameMr: 'सुपा', nameEn: 'Supa' }, { nameMr: 'निघोज', nameEn: 'Nighoj' }, { nameMr: 'राळेगण सिद्धी', nameEn: 'Ralegan Siddhi' }] },
    ]
  },
  {
    id: 'chhatrapati_sambhajinagar',
    nameMr: 'छत्रपती संभाजीनगर / औरंगाबाद (Chhatrapati Sambhajinagar / Aurangabad)',
    nameEn: 'Chhatrapati Sambhajinagar',
    aliases: ['Aurangabad', 'Sambhajinagar'],
    talukas: [
      { id: 'aurangabad_t', nameMr: 'छत्रपती संभाजीनगर (Chhatrapati Sambhajinagar)', nameEn: 'Chhatrapati Sambhajinagar', villages: [{ nameMr: 'चिखलठाणा', nameEn: 'Chikalthana' }, { nameMr: 'गांधेली', nameEn: 'Gandheli' }] },
      { id: 'paithan', nameMr: 'पैठण (Paithan)', nameEn: 'Paithan', villages: [{ nameMr: 'बिडकीन', nameEn: 'Bidkin' }, { nameMr: 'पाचोड', nameEn: 'Pachod' }, { nameMr: 'विहामांडवा', nameEn: 'Vihamandwa' }] },
      { id: 'sillod', nameMr: 'सिल्लोड (Sillod)', nameEn: 'Sillod', villages: [{ nameMr: 'अंजिंठा', nameEn: 'Ajanta' }, { nameMr: 'अंधारी', nameEn: 'Andhari' }] },
      { id: 'gangapur', nameMr: 'गंगापूर (Gangapur)', nameEn: 'Gangapur', villages: [{ nameMr: 'वाळूज', nameEn: 'Waluj' }, { nameMr: 'लासूर स्टेशन', nameEn: 'Lasur Station' }] },
      { id: 'vaijapur', nameMr: 'वैजापूर (Vaijapur)', nameEn: 'Vaijapur', villages: [{ nameMr: 'शिवूर', nameEn: 'Shivur' }, { nameMr: 'खंडाळा', nameEn: 'Khandala' }] },
      { id: 'kannad', nameMr: 'कन्नड (Kannad)', nameEn: 'Kannad', villages: [{ nameMr: 'पिशोर', nameEn: 'Pishor' }, { nameMr: 'देवगाव रंगारी', nameEn: 'Devgaon Rangari' }] },
      { id: 'khultabad', nameMr: 'खुल्ताबाद (Khultabad)', nameEn: 'Khultabad', villages: [{ nameMr: 'वेरूळ', nameEn: 'Ellora/Verul' }, { nameMr: 'कच्छीघाटी', nameEn: 'Kachhighati' }] },
      { id: 'phulambri', nameMr: 'फूलंब्री (Phulambri)', nameEn: 'Phulambri', villages: [{ nameMr: 'वडोद बाजार', nameEn: 'Vadod Bazar' }, { nameMr: 'पाल', nameEn: 'Pal' }] },
      { id: 'soegaon', nameMr: 'सोयगाव (Soegaon)', nameEn: 'Soegaon', villages: [{ nameMr: 'फरदापूर', nameEn: 'Fardapur' }, { nameMr: 'बनापूर', nameEn: 'Banapur' }] },
    ]
  },
  {
    id: 'dharashiv',
    nameMr: 'धाराशिव / उस्मानाबाद (Dharashiv / Osmanabad)',
    nameEn: 'Dharashiv',
    aliases: ['Osmanabad'],
    talukas: [
      { id: 'dharashiv_t', nameMr: 'धाराशिव (Dharashiv)', nameEn: 'Dharashiv', villages: [{ nameMr: 'येडशी', nameEn: 'Yedshi' }, { nameMr: 'तेर', nameEn: 'Ter' }, { nameMr: 'पडोळी', nameEn: 'Padoli' }] },
      { id: 'tuljapur', nameMr: 'तुळजापूर (Tuljapur)', nameEn: 'Tuljapur', villages: [{ nameMr: 'तामलवाडी', nameEn: 'Tamalwadi' }, { nameMr: 'अणदूर', nameEn: 'Andur' }, { nameMr: 'सावरगाव', nameEn: 'Savargaon' }] },
      { id: 'omerga', nameMr: 'उमरगा (Omerga)', nameEn: 'Omerga', villages: [{ nameMr: 'मुरूम', nameEn: 'Murum' }, { nameMr: 'त्रिगुळी', nameEn: 'Triguli' }] },
      { id: 'paranda', nameMr: 'परंडा (Paranda)', nameEn: 'Paranda', villages: [{ nameMr: 'अनाळा', nameEn: 'Anala' }, { nameMr: 'सोनारी', nameEn: 'Sonari' }] },
      { id: 'bhoom', nameMr: 'भूम (Bhoom)', nameEn: 'Bhoom', villages: [{ nameMr: 'पाथरुड', nameEn: 'Pathrud' }, { nameMr: 'ईट', nameEn: 'Eat' }] },
      { id: 'kalamb_d', nameMr: 'कलम (Kalamb)', nameEn: 'Kalamb', villages: [{ nameMr: 'शिराढोण', nameEn: 'Shiradhon' }, { nameMr: 'गोविंदपूर', nameEn: 'Govindpur' }] },
      { id: 'washi', nameMr: 'वाशी (Washi)', nameEn: 'Washi', villages: [{ nameMr: 'पारा', nameEn: 'Para' }, { nameMr: 'तेरखेडा', nameEn: 'Terkheda' }] },
      { id: 'lohara', nameMr: 'लोहारा (Lohara)', nameEn: 'Lohara', villages: [{ nameMr: 'कानेगाव', nameEn: 'Kanegaon' }, { nameMr: 'माकणी', nameEn: 'Makani' }] },
    ]
  },
  {
    id: 'yavatmal',
    nameMr: 'यवतमाळ (Yavatmal)',
    nameEn: 'Yavatmal',
    talukas: [
      { id: 'yavatmal_t', nameMr: 'यवतमाळ (Yavatmal)', nameEn: 'Yavatmal', villages: [{ nameMr: 'सावरगड', nameEn: 'Sawargad' }, { nameMr: 'भांब राजा', nameEn: 'Bhamb Raja' }] },
      { id: 'kelapur', nameMr: 'केळापूर - पांढरकवडा (Kelapur)', nameEn: 'Kelapur', aliases: ['Pandharkawada'], villages: [{ nameMr: 'पांढरकवडा', nameEn: 'Pandharkawada' }, { nameMr: 'करणजी', nameEn: 'Karanji' }, { nameMr: 'मांजरी', nameEn: 'Manjari' }, { nameMr: 'पाटण', nameEn: 'Patan' }] },
      { id: 'pusad', nameMr: 'पुसद (Pusad)', nameEn: 'Pusad', villages: [{ nameMr: 'काटखेडा', nameEn: 'Katkheda' }, { nameMr: 'शेलू', nameEn: 'Shelu' }, { nameMr: 'मोप', nameEn: 'Mop' }] },
      { id: 'umarkhed', nameMr: 'उमरखेड (Umarkhed)', nameEn: 'Umarkhed', villages: [{ nameMr: 'ढाणकी', nameEn: 'Dhanki' }, { nameMr: 'विड्रुळ', nameEn: 'Vidrul' }] },
      { id: 'darwha', nameMr: 'दारव्हा (Darwha)', nameEn: 'Darwha', villages: [{ nameMr: 'लाडखेड', nameEn: 'Ladkhed' }, { nameMr: 'बोरी', nameEn: 'Bori' }] },
      { id: 'digras', nameMr: 'दिग्रस (Digras)', nameEn: 'Digras', villages: [{ nameMr: 'सिंगद', nameEn: 'Singad' }, { nameMr: 'कळगाव', nameEn: 'Kalgaon' }] },
      { id: 'arni', nameMr: 'आर्णी (Arni)', nameEn: 'Arni', villages: [{ nameMr: 'लोणी', nameEn: 'Loni' }, { nameMr: 'बोरगाव', nameEn: 'Borgaon' }] },
      { id: 'wani', nameMr: 'वणी (Wani)', nameEn: 'Wani', villages: [{ nameMr: 'शिंदोला', nameEn: 'Shindola' }, { nameMr: 'कायरा', nameEn: 'Kayar' }] },
      { id: 'maregaon', nameMr: 'मारेगाव (Maregaon)', nameEn: 'Maregaon', villages: [{ nameMr: 'कुंभा', nameEn: 'Kumbha' }, { nameMr: 'वेगाव', nameEn: 'Vegao' }] },
      { id: 'zari_jamani', nameMr: 'झरी जामणी (Zari Jamani)', nameEn: 'Zari Jamani', villages: [{ nameMr: 'पाटण', nameEn: 'Patan' }, { nameMr: 'मुकुटबन', nameEn: 'Mukutban' }] },
      { id: 'ghatanji', nameMr: 'घाटंजी (Ghatanji)', nameEn: 'Ghatanji', villages: [{ nameMr: 'पारवा', nameEn: 'Parwa' }, { nameMr: 'शिर्ली', nameEn: 'Shirli' }] },
      { id: 'ralegaon', nameMr: 'राळेगाव (Ralegaon)', nameEn: 'Ralegaon', villages: [{ nameMr: 'वडकी', nameEn: 'Wadki' }, { nameMr: 'झाडगाव', nameEn: 'Jhadgaon' }] },
      { id: 'kalamb_y', nameMr: 'कलम (Kalamb)', nameEn: 'Kalamb', villages: [{ nameMr: 'कोठा', nameEn: 'Kotha' }, { nameMr: 'रासोडा', nameEn: 'Rasoda' }] },
      { id: 'babhulgaon', nameMr: 'बाभूळगाव (Babhulgaon)', nameEn: 'Babhulgaon', villages: [{ nameMr: 'पहूर', nameEn: 'Pahur' }, { nameMr: 'नायगाव', nameEn: 'Naygaon' }] },
      { id: 'ner', nameMr: 'नेर (Ner)', nameEn: 'Ner', villages: [{ nameMr: 'माणिकवाडा', nameEn: 'Manikwada' }, { nameMr: 'इंदापूर', nameEn: 'Indapur' }] },
      { id: 'mahagaon', nameMr: 'महागाव (Mahagaon)', nameEn: 'Mahagaon', villages: [{ nameMr: 'फुलसावंगी', nameEn: 'Pulsawangi' }, { nameMr: 'आनंदनगर', nameEn: 'Anandnagar' }] },
    ]
  },
  {
    id: 'amravati',
    nameMr: 'अमरावती (Amravati)',
    nameEn: 'Amravati',
    talukas: [
      { id: 'amravati_t', nameMr: 'अमरावती (Amravati)', nameEn: 'Amravati', villages: [{ nameMr: 'बडनेरा', nameEn: 'Badnera' }, { nameMr: 'वळगाव', nameEn: 'Walgaon' }] },
      { id: 'achalpur', nameMr: 'अचलपूर (Achalpur)', nameEn: 'Achalpur', aliases: ['Paratwada'], villages: [{ nameMr: 'परतवाडा', nameEn: 'Paratwada' }, { nameMr: 'पथ्रोट', nameEn: 'Pathrot' }] },
      { id: 'warud', nameMr: 'वरुड (Warud)', nameEn: 'Warud', villages: [{ nameMr: 'शेंडूरजना घाट', nameEn: 'Shendurjana Ghat' }, { nameMr: 'राजुरा बाजार', nameEn: 'Rajura Bazar' }] },
      { id: 'morshi', nameMr: 'मोर्शी (Morshi)', nameEn: 'Morshi', villages: [{ nameMr: 'हिवरखेड', nameEn: 'Hivarkhed' }, { nameMr: 'नेर पिंगळाई', nameEn: 'Ner Pingalai' }] },
      { id: 'chandur_bazar', nameMr: 'चांदूर बाजार (Chandur Bazar)', nameEn: 'Chandur Bazar', villages: [{ nameMr: 'शिरजगाव कसबा', nameEn: 'Shirajgaon Kasba' }, { nameMr: 'आसेगाव', nameEn: 'Asegaon' }] },
      { id: 'anjangaon_surji', nameMr: 'अंजनगाव सुर्जी (Anjangaon Surji)', nameEn: 'Anjangaon Surji', villages: [{ nameMr: 'सामुद्रपूर', nameEn: 'Samudrapur' }, { nameMr: 'चिंचोली', nameEn: 'Chincholi' }] },
      { id: 'daryapur', nameMr: 'दर्यापूर (Daryapur)', nameEn: 'Daryapur', villages: [{ nameMr: 'येवदा', nameEn: 'Yevda' }, { nameMr: 'बनापूर', nameEn: 'Banapur' }] },
      { id: 'dhamangaon_railway', nameMr: 'धामणगाव रेल्वे (Dhamangaon Railway)', nameEn: 'Dhamangaon Railway', villages: [{ nameMr: 'दत्तापूर', nameEn: 'Dattapur' }, { nameMr: 'देवगाव', nameEn: 'Devgaon' }] },
      { id: 'nandgaon_khandeshwar', nameMr: 'नांदगाव खंडेश्वर (Nandgaon Khandeshwar)', nameEn: 'Nandgaon Khandeshwar', villages: [{ nameMr: 'मंगरूळ चव्हाळा', nameEn: 'Mangrul Chawala' }, { nameMr: 'पापळ', nameEn: 'Papal' }] },
      { id: 'chandur_railway', nameMr: 'चांदूर रेल्वे (Chandur Railway)', nameEn: 'Chandur Railway', villages: [{ nameMr: 'मांजरी म्हसला', nameEn: 'Manjari Mhasla' }] },
      { id: 'bhatkuli', nameMr: 'भातकुली (Bhatkuli)', nameEn: 'Bhatkuli', villages: [{ nameMr: 'निंभोरा', nameEn: 'Nimbhora' }] },
      { id: 'chikhaldara', nameMr: 'चिखलदरा (Chikhaldara)', nameEn: 'Chikhaldara', villages: [{ nameMr: 'सेमाडोह', nameEn: 'Semadoh' }, { nameMr: 'मोझरी', nameEn: 'Mozari' }] },
      { id: 'dharni', nameMr: 'धारणी (Dharni)', nameEn: 'Dharni', villages: [{ nameMr: 'सादाबाडी', nameEn: 'Sadabadi' }] },
      { id: 'teosa', nameMr: 'तिवसा (Teosa)', nameEn: 'Teosa', villages: [{ nameMr: 'गुरुकुंज मोझरी', nameEn: 'Gurukunj Mozari' }, { nameMr: 'वरखेड', nameEn: 'Varkhed' }] },
    ]
  },
  {
    id: 'akola',
    nameMr: 'अकोला (Akola)',
    nameEn: 'Akola',
    talukas: [
      { id: 'akola_t', nameMr: 'अकोला (Akola)', nameEn: 'Akola', villages: [{ nameMr: 'शिवणी', nameEn: 'Shivani' }, { nameMr: 'कापशी', nameEn: 'Kapashi' }] },
      { id: 'akot', nameMr: 'अकोट (Akot)', nameEn: 'Akot', villages: [{ nameMr: 'अकोली', nameEn: 'Akoli' }, { nameMr: 'चोहोट्टा बाजार', nameEn: 'Chohatta Bazar' }] },
      { id: 'balapur', nameMr: 'बाळापूर (Balapur)', nameEn: 'Balapur', villages: [{ nameMr: 'पारस', nameEn: 'Paras' }, { nameMr: 'उरळ', nameEn: 'Ural' }] },
      { id: 'murtizapur', nameMr: 'मूर्तीजापूर (Murtizapur)', nameEn: 'Murtizapur', villages: [{ nameMr: 'माना', nameEn: 'Mana' }, { nameMr: 'सिरसो', nameEn: 'Sirso' }] },
      { id: 'telhara', nameMr: 'तेल्हारा (Telhara)', nameEn: 'Telhara', villages: [{ nameMr: 'हिवरखेड', nameEn: 'Hivarkhed' }, { nameMr: 'अडगाव', nameEn: 'Adgaon' }] },
      { id: 'patur', nameMr: 'पातूर (Patur)', nameEn: 'Patur', villages: [{ nameMr: 'बाभुळगाव', nameEn: 'Babhulgaon' }, { nameMr: 'अलेगाव', nameEn: 'Alegaon' }] },
      { id: 'barshitakli', nameMr: 'बारशीटाकळी (Barshitakli)', nameEn: 'Barshitakli', villages: [{ nameMr: 'महान', nameEn: 'Mahan' }, { nameMr: 'पिंजर', nameEn: 'Pinjar' }] },
    ]
  },
  {
    id: 'washim',
    nameMr: 'वाशीम (Washim)',
    nameEn: 'Washim',
    talukas: [
      { id: 'washim_t', nameMr: 'वाशीम (Washim)', nameEn: 'Washim', villages: [{ nameMr: 'अनशिंग', nameEn: 'Ansing' }, { nameMr: 'सुपखेला', nameEn: 'Supkhela' }] },
      { id: 'karanja_w', nameMr: 'कारंजा (Karanja)', nameEn: 'Karanja', villages: [{ nameMr: 'उमरडा', nameEn: 'Umarda' }, { nameMr: 'कामाठा', nameEn: 'Kamatha' }] },
      { id: 'risod', nameMr: 'रिसोड (Risod)', nameEn: 'Risod', villages: [{ nameMr: 'लोणी', nameEn: 'Loni' }, { nameMr: 'भर जहांगीर', nameEn: 'Bhar Jahangir' }] },
      { id: 'malegaon_w', nameMr: 'मालेगाव (Malegaon)', nameEn: 'Malegaon', villages: [{ nameMr: 'सिरपूर', nameEn: 'Sirpur' }, { nameMr: 'मेडशी', nameEn: 'Medshi' }] },
      { id: 'mangrulpir', nameMr: 'मंगरुळपीर (Mangrulpir)', nameEn: 'Mangrulpir', villages: [{ nameMr: 'मानोरा रोड', nameEn: 'Manora Road' }, { nameMr: 'शेलू', nameEn: 'Shelu' }] },
      { id: 'manora', nameMr: 'मानोरा (Manora)', nameEn: 'Manora', villages: [{ nameMr: 'पोहरादेवी', nameEn: 'Pohradevi' }, { nameMr: 'सोईट', nameEn: 'Soit' }] },
    ]
  },
  {
    id: 'buldhana',
    nameMr: 'बुलढाणा (Buldhana)',
    nameEn: 'Buldhana',
    talukas: [
      { id: 'buldhana_t', nameMr: 'बुलढाणा (Buldhana)', nameEn: 'Buldhana', villages: [{ nameMr: 'सुंडखेड', nameEn: 'Sundkhed' }, { nameMr: 'धाड', nameEn: 'Dhad' }] },
      { id: 'khamgaon', nameMr: 'खामगाव (Khamgaon)', nameEn: 'Khamgaon', villages: [{ nameMr: 'अटळी', nameEn: 'Atali' }, { nameMr: 'झटाळा', nameEn: 'Jhatala' }] },
      { id: 'malkapur', nameMr: 'मलकापूर (Malkapur)', nameEn: 'Malkapur', villages: [{ nameMr: 'उमळी', nameEn: 'Umali' }, { nameMr: 'दसराखेड', nameEn: 'Dasrakhed' }] },
      { id: 'shegaon', nameMr: 'शेगाव (Shegaon)', nameEn: 'Shegaon', villages: [{ nameMr: 'जलंब', nameEn: 'Jalamb' }, { nameMr: 'पहुरी', nameEn: 'Pahuri' }] },
      { id: 'mehkar', nameMr: 'महेकर (Mehkar)', nameEn: 'Mehkar', villages: [{ nameMr: 'जानेफळ', nameEn: 'Janefal' }, { nameMr: 'डोणगाव', nameEn: 'Dongaon' }] },
      { id: 'chikhli', nameMr: 'चिखली (Chikhli)', nameEn: 'Chikhli', villages: [{ nameMr: 'अंधारे', nameEn: 'Andhare' }, { nameMr: 'मेरा', nameEn: 'Mera' }] },
      { id: 'nandura', nameMr: 'नांदुरा (Nandura)', nameEn: 'Nandura', villages: [{ nameMr: 'निंबोरा', nameEn: 'Nimbhora' }, { nameMr: 'वडनेर', nameEn: 'Vadner' }] },
      { id: 'jalgaon_jamod', nameMr: 'जळगाव जामोद (Jalgaon Jamod)', nameEn: 'Jalgaon Jamod', villages: [{ nameMr: 'जामोद', nameEn: 'Jamod' }, { nameMr: 'खामोरा', nameEn: 'Khamora' }] },
      { id: 'sangrampur', nameMr: 'संग्रामपूर (Sangrampur)', nameEn: 'Sangrampur', villages: [{ nameMr: 'पसोडा', nameEn: 'Pasoda' }] },
      { id: 'deulgaon_raja', nameMr: 'देऊळगाव राजा (Deulgaon Raja)', nameEn: 'Deulgaon Raja', villages: [{ nameMr: 'सिनगाव', nameEn: 'Singaon' }] },
      { id: 'sindkhed_raja', nameMr: 'सिंदखेड राजा (Sindkhed Raja)', nameEn: 'Sindkhed Raja', villages: [{ nameMr: 'किनगाव राजा', nameEn: 'Kingaon Raja' }, { nameMr: 'दुसरबीड', nameEn: 'Dusarbid' }] },
      { id: 'motala', nameMr: 'मोताळा (Motala)', nameEn: 'Motala', villages: [{ nameMr: 'धामणगाव', nameEn: 'Dhamangaon' }, { nameMr: 'बोराडी', nameEn: 'Boradi' }] },
      { id: 'lonar', nameMr: 'लोणार (Lonar)', nameEn: 'Lonar', villages: [{ nameMr: 'सुलतानपूर', nameEn: 'Sultanpur' }, { nameMr: 'टिटवी', nameEn: 'Titwi' }] },
    ]
  },
  {
    id: 'nanded',
    nameMr: 'नांदेड (Nanded)',
    nameEn: 'Nanded',
    talukas: [
      { id: 'nanded_t', nameMr: 'नांदेड (Nanded)', nameEn: 'Nanded', villages: [{ nameMr: 'विष्णुपुरी', nameEn: 'Vishnupuri' }, { nameMr: 'वाजगाव', nameEn: 'Wajgaon' }] },
      { id: 'hadgaon', nameMr: 'हदगाव (Hadgaon)', nameEn: 'Hadgaon', villages: [{ nameMr: 'तामसा', nameEn: 'Tamsa' }, { nameMr: 'मनाठा', nameEn: 'Manatha' }] },
      { id: 'kinwat', nameMr: 'किनवट (Kinwat)', nameEn: 'Kinwat', villages: [{ nameMr: 'इस्लापूर', nameEn: 'Islapur' }, { nameMr: 'शिवणी', nameEn: 'Shivani' }] },
      { id: 'bhokar', nameMr: 'भोकर (Bhokar)', nameEn: 'Bhokar', villages: [{ nameMr: 'मोघळी', nameEn: 'Moghali' }] },
      { id: 'degloor', nameMr: 'देगलूर (Degloor)', nameEn: 'Degloor', villages: [{ nameMr: 'हानेगाव', nameEn: 'Hanegaon' }, { nameMr: 'शहापूर', nameEn: 'Shahapur' }] },
      { id: 'kandhar', nameMr: 'कंधार (Kandhar)', nameEn: 'Kandhar', villages: [{ nameMr: 'उस्माननगर', nameEn: 'Usmannagar' }, { nameMr: 'पेठवडज', nameEn: 'Pethwadaj' }] },
      { id: 'mukhed', nameMr: 'मुखेड (Mukhed)', nameEn: 'Mukhed', villages: [{ nameMr: 'जामखेड', nameEn: 'Jamkhed' }, { nameMr: 'मुक्रमाबाद', nameEn: 'Mukramabad' }] },
      { id: 'biloli', nameMr: 'बिलोली (Biloli)', nameEn: 'Biloli', villages: [{ nameMr: 'कुंडलवाडी', nameEn: 'Kundalwadi' }, { nameMr: 'लोहा गाव', nameEn: 'Loha Gaon' }] },
      { id: 'loha', nameMr: 'लोहा (Loha)', nameEn: 'Loha', villages: [{ nameMr: 'कुरुळा', nameEn: 'Kurula' }, { nameMr: 'माळेगाव', nameEn: 'Malegaon' }] },
      { id: 'mudkhed', nameMr: 'मुदखेड (Mudkhed)', nameEn: 'Mudkhed', villages: [{ nameMr: 'मुगट', nameEn: 'Mugat' }] },
      { id: 'umri', nameMr: 'उमरी (Umri)', nameEn: 'Umri', villages: [{ nameMr: 'गोरठा', nameEn: 'Gortha' }] },
      { id: 'dharmabad', nameMr: 'धर्माबाद (Dharmabad)', nameEn: 'Dharmabad', villages: [{ nameMr: 'कारखेली', nameEn: 'Karkheli' }] },
      { id: 'mahoor', nameMr: 'माहूर (Mahoor)', nameEn: 'Mahoor', villages: [{ nameMr: 'वाानोळा', nameEn: 'Wanola' }] },
      { id: 'naigaon', nameMr: 'नायगाव (Naigaon)', nameEn: 'Naigaon', villages: [{ nameMr: 'मांजरम', nameEn: 'Manjaram' }] },
      { id: 'ardhapur', nameMr: 'अर्धापूर (Ardhapur)', nameEn: 'Ardhapur', villages: [{ nameMr: 'माळेगाव', nameEn: 'Malegaon' }] },
      { id: 'himayatnagar', nameMr: 'हिमायतनगर (Himayatnagar)', nameEn: 'Himayatnagar', villages: [{ nameMr: 'सरसम', nameEn: 'Sarsam' }] },
    ]
  },
  {
    id: 'latur',
    nameMr: 'लातूर (Latur)',
    nameEn: 'Latur',
    talukas: [
      { id: 'latur_t', nameMr: 'लातूर (Latur)', nameEn: 'Latur', villages: [{ nameMr: 'भातांगळी', nameEn: 'Bhatangali' }, { nameMr: 'हरंगूळ', nameEn: 'Harangul' }, { nameMr: 'मुुरुड', nameEn: 'Murud' }] },
      { id: 'udgir', nameMr: 'उदगीर (Udgir)', nameEn: 'Udgir', villages: [{ nameMr: 'नळगीर', nameEn: 'Nalgir' }, { nameMr: 'हेर', nameEn: 'Her' }] },
      { id: 'ahmedpur', nameMr: 'अहमदपूर (Ahmedpur)', nameEn: 'Ahmedpur', villages: [{ nameMr: 'किनगाव', nameEn: 'Kingaon' }, { nameMr: 'शिरुर ताजबंद', nameEn: 'Shirur Tajband' }] },
      { id: 'nilanga', nameMr: 'निलंगा (Nilanga)', nameEn: 'Nilanga', villages: [{ nameMr: 'कासार शिरसी', nameEn: 'Kasar Shirsi' }, { nameMr: 'औरद शहाजानी', nameEn: 'Aurad Shahajani' }] },
      { id: 'ausa', nameMr: 'औसा (Ausa)', nameEn: 'Ausa', villages: [{ nameMr: 'किल्लारी', nameEn: 'Killari' }, { nameMr: 'लामजना', nameEn: 'Lamjana' }] },
      { id: 'chakur', nameMr: 'चाकूर (Chakur)', nameEn: 'Chakur', villages: [{ nameMr: 'नळेगाव', nameEn: 'Nalegaon' }, { nameMr: 'लातूर रोड', nameEn: 'Latur Road' }] },
      { id: 'renapur', nameMr: 'रेणापूर (Renapur)', nameEn: 'Renapur', villages: [{ nameMr: 'पानगाव', nameEn: 'Pangaon' }, { nameMr: 'पोहरेगाव', nameEn: 'Pohregaon' }] },
      { id: 'deoni', nameMr: 'देवणी (Deoni)', nameEn: 'Deoni', villages: [{ nameMr: 'वालंडी', nameEn: 'Walandi' }] },
      { id: 'shirur_anantpal', nameMr: 'शिरूर अनंतपाळ (Shirur Anantpal)', nameEn: 'Shirur Anantpal', villages: [{ nameMr: 'साकाोल', nameEn: 'Sakol' }] },
      { id: 'jalkot', nameMr: 'जळकोट (Jalkot)', nameEn: 'Jalkot', villages: [{ nameMr: 'धोत्री', nameEn: 'Dhotri' }] },
    ]
  },
  {
    id: 'beed',
    nameMr: 'बीड (Beed)',
    nameEn: 'Beed',
    talukas: [
      { id: 'beed_t', nameMr: 'बीड (Beed)', nameEn: 'Beed', villages: [{ nameMr: 'पाली', nameEn: 'Pali' }, { nameMr: 'चौसाळा', nameEn: 'Chausala' }, { nameMr: 'मांजरसुंबा', nameEn: 'Manjarsumba' }] },
      { id: 'ambajogai', nameMr: 'अंबेजोगाई (Ambajogai)', nameEn: 'Ambajogai', villages: [{ nameMr: 'घाटनांदूर', nameEn: 'Ghatnandur' }, { nameMr: 'बरडपूर', nameEn: 'Bardpur' }] },
      { id: 'parli', nameMr: 'परळी (Parli)', nameEn: 'Parli', aliases: ['Parli Vaijnath'], villages: [{ nameMr: 'धर्मपुरी', nameEn: 'Dharmapuri' }, { nameMr: 'सिरसाळा', nameEn: 'Sirsala' }] },
      { id: 'majalgaon', nameMr: 'माजलगाव (Majalgaon)', nameEn: 'Majalgaon', villages: [{ nameMr: 'पाथरी', nameEn: 'Pathri' }, { nameMr: 'टाकळी', nameEn: 'Takli' }] },
      { id: 'georai', nameMr: 'गेवराई (Georai)', nameEn: 'Georai', villages: [{ nameMr: 'उमरी', nameEn: 'Umri' }, { nameMr: 'तलवाडा', nameEn: 'Talwada' }] },
      { id: 'kaij', nameMr: 'केज (Kaij)', nameEn: 'Kaij', villages: [{ nameMr: 'युसुफवडगाव', nameEn: 'Yusufwadgaon' }, { nameMr: 'होळ', nameEn: 'Hol' }] },
      { id: 'ashti_b', nameMr: 'आष्टी (Ashti)', nameEn: 'Ashti', villages: [{ nameMr: 'कडा', nameEn: 'Kada' }, { nameMr: 'धानोरा', nameEn: 'Dhanora' }] },
      { id: 'patoda', nameMr: 'पाटोदा (Patoda)', nameEn: 'Patoda', villages: [{ nameMr: 'अंमळनेर', nameEn: 'Amalner' }] },
      { id: 'shirur_kasar', nameMr: 'शिरूर कासार (Shirur Kasar)', nameEn: 'Shirur Kasar', villages: [{ nameMr: 'रायमोहा', nameEn: 'Raimoha' }] },
      { id: 'wadwani', nameMr: 'वडवणी (Wadwani)', nameEn: 'Wadwani', villages: [{ nameMr: 'चिंचवण', nameEn: 'Chinchwan' }] },
      { id: 'dharur', nameMr: 'धारूर (Dharur)', nameEn: 'Dharur', villages: [{ nameMr: 'तेलगाव', nameEn: 'Telgaon' }] },
    ]
  },
  {
    id: 'jalna',
    nameMr: 'जालना (Jalna)',
    nameEn: 'Jalna',
    talukas: [
      { id: 'jalna_t', nameMr: 'जालना (Jalna)', nameEn: 'Jalna', villages: [{ nameMr: 'नेर', nameEn: 'Ner' }, { nameMr: 'रामनगर', nameEn: 'Ramnagar' }] },
      { id: 'ambad', nameMr: 'अंबड (Ambad)', nameEn: 'Ambad', villages: [{ nameMr: 'वडीगोद्री', nameEn: 'Wadigodri' }, { nameMr: 'शहागड', nameEn: 'Shahagad' }] },
      { id: 'partur', nameMr: 'परतूर (Partur)', nameEn: 'Partur', villages: [{ nameMr: 'आष्टी', nameEn: 'Ashti' }, { nameMr: 'सातोना', nameEn: 'Satona' }] },
      { id: 'bhokardan', nameMr: 'भोकरदन (Bhokardan)', nameEn: 'Bhokardan', villages: [{ nameMr: 'हसनाबाद', nameEn: 'Hasnabad' }, { nameMr: 'राजूर', nameEn: 'Rajur' }] },
      { id: 'jafrabad', nameMr: 'जाफ्राबाद (Jafrabad)', nameEn: 'Jafrabad', villages: [{ nameMr: 'टेंभुर्णी', nameEn: 'Tembhurni' }, { nameMr: 'वरुड', nameEn: 'Warud' }] },
      { id: 'badnapur', nameMr: 'बदनापूर (Badnapur)', nameEn: 'Badnapur', villages: [{ nameMr: 'रोषनगाव', nameEn: 'Roshangaon' }] },
      { id: 'ghansawangi', nameMr: 'घनसावंगी (Ghansawangi)', nameEn: 'Ghansawangi', villages: [{ nameMr: 'तीर्थपुरी', nameEn: 'Tirthpuri' }, { nameMr: 'कुंभारपिंपळगाव', nameEn: 'Kumbharpimpalgaon' }] },
      { id: 'mantha', nameMr: 'मंठा (Mantha)', nameEn: 'Mantha', villages: [{ nameMr: 'हेलस', nameEn: 'Helas' }] },
    ]
  },
  {
    id: 'parbhani',
    nameMr: 'परभणी (Parbhani)',
    nameEn: 'Parbhani',
    talukas: [
      { id: 'parbhani_t', nameMr: 'परभणी (Parbhani)', nameEn: 'Parbhani', villages: [{ nameMr: 'शिंगणापूर', nameEn: 'Shingnapur' }, { nameMr: 'पिंगळी', nameEn: 'Pingali' }] },
      { id: 'gangakhed', nameMr: 'गंगाखेड (Gangakhed)', nameEn: 'Gangakhed', villages: [{ nameMr: 'माखणी', nameEn: 'Makhani' }, { nameMr: 'राणीसावरगाव', nameEn: 'Ranisawargaon' }] },
      { id: 'pathri', nameMr: 'पाथरी (Pathri)', nameEn: 'Pathri', villages: [{ nameMr: 'रामपूर मुधोळ', nameEn: 'Rampur Mudhol' }] },
      { id: 'jintur', nameMr: 'जिंतूर (Jintur)', nameEn: 'Jintur', villages: [{ nameMr: 'चारठाणा', nameEn: 'Charthana' }, { nameMr: 'बामणी', nameEn: 'Bamani' }] },
      { id: 'sailu', nameMr: 'सेलू (Sailu)', nameEn: 'Sailu', villages: [{ nameMr: 'वालूर', nameEn: 'Walur' }] },
      { id: 'palam', nameMr: 'पालम (Palam)', nameEn: 'Palam', villages: [{ nameMr: 'पेठशिवणी', nameEn: 'Pethshivani' }] },
      { id: 'purna', nameMr: 'पूर्णा (Purna)', nameEn: 'Purna', villages: [{ nameMr: 'ताडकळस', nameEn: 'Tadkalas' }] },
      { id: 'manwath', nameMr: 'मानवत (Manwath)', nameEn: 'Manwath', villages: [{ nameMr: 'रामपूरी', nameEn: 'Rampuri' }] },
      { id: 'sonpeth', nameMr: 'सोनपेठ (Sonpeth)', nameEn: 'Sonpeth', villages: [{ nameMr: 'शेळगाव', nameEn: 'Shelgaon' }] },
    ]
  },
  {
    id: 'hingoli',
    nameMr: 'हिंगोली (Hingoli)',
    nameEn: 'Hingoli',
    talukas: [
      { id: 'hingoli_t', nameMr: 'हिंगोली (Hingoli)', nameEn: 'Hingoli', villages: [{ nameMr: 'सरसम', nameEn: 'Sarsam' }, { nameMr: 'नरसी', nameEn: 'Narsi' }] },
      { id: 'basmath', nameMr: 'वसमत (Basmath)', nameEn: 'Basmath', villages: [{ nameMr: 'कुरुंदा', nameEn: 'Kurunda' }, { nameMr: 'हयातनगर', nameEn: 'Hayatnagar' }] },
      { id: 'kalamnuri', nameMr: 'कलमनुरी (Kalamnuri)', nameEn: 'Kalamnuri', villages: [{ nameMr: 'आखाडा बाळापूर', nameEn: 'Akhada Balapur' }] },
      { id: 'aundha_nagnath', nameMr: 'औंढा नागनाथ (Aundha Nagnath)', nameEn: 'Aundha Nagnath', villages: [{ nameMr: 'जवळा बाजार', nameEn: 'Jawala Bazar' }] },
      { id: 'sengaon', nameMr: 'सेनगाव (Sengaon)', nameEn: 'Sengaon', villages: [{ nameMr: 'गोरेगाव', nameEn: 'Goregaon' }] },
    ]
  },
  {
    id: 'jalgaon',
    nameMr: 'जळगाव (Jalgaon)',
    nameEn: 'Jalgaon',
    talukas: [
      { id: 'jalgaon_t', nameMr: 'जळगाव (Jalgaon)', nameEn: 'Jalgaon', villages: [{ nameMr: 'म्हसावद', nameEn: 'Mhasawad' }, { nameMr: 'नांद्रा', nameEn: 'Nandra' }] },
      { id: 'bhusawal', nameMr: 'भुसावळ (Bhusawal)', nameEn: 'Bhusawal', villages: [{ nameMr: 'वरणगाव', nameEn: 'Varangaon' }] },
      { id: 'chalisgaon', nameMr: 'चाळीसगाव (Chalisgaon)', nameEn: 'Chalisgaon', villages: [{ nameMr: 'भातोडे', nameEn: 'Bhatode' }, { nameMr: 'मेहुणबारे', nameEn: 'Mehunbare' }] },
      { id: 'amalner', nameMr: 'अमळनेर (Amalner)', nameEn: 'Amalner', villages: [{ nameMr: 'मारवड', nameEn: 'Marwad' }] },
      { id: 'chopda', nameMr: 'चोपडा (Chopda)', nameEn: 'Chopda', villages: [{ nameMr: 'अडावद', nameEn: 'Adawad' }] },
      { id: 'jamner', nameMr: 'जामनेर (Jamner)', nameEn: 'Jamner', villages: [{ nameMr: 'पहूर', nameEn: 'Pahur' }, { nameMr: 'नेरी', nameEn: 'Neri' }] },
      { id: 'pachora', nameMr: 'पाचोरा (Pachora)', nameEn: 'Pachora', villages: [{ nameMr: 'पिंपळगाव', nameEn: 'Pimpalgaon' }] },
      { id: 'erandol', nameMr: 'एरंडोल (Erandol)', nameEn: 'Erandol', villages: [{ nameMr: 'कासोदा', nameEn: 'Kasoda' }] },
      { id: 'yaval', nameMr: 'यावल (Yaval)', nameEn: 'Yaval', villages: [{ nameMr: 'साकळी', nameEn: 'Sakali' }] },
      { id: 'raver', nameMr: 'रावेर (Raver)', nameEn: 'Raver', villages: [{ nameMr: 'सावदा', nameEn: 'Savda' }, { nameMr: 'खिरोदा', nameEn: 'Khiroda' }] },
      { id: 'parola', nameMr: 'पारोळा (Parola)', nameEn: 'Parola', villages: [{ nameMr: 'ताम्हसडी', nameEn: 'Tamhasadi' }] },
      { id: 'dharangaon', nameMr: 'धरणगाव (Dharangaon)', nameEn: 'Dharangaon', villages: [{ nameMr: 'पाळधी', nameEn: 'Paldhi' }] },
      { id: 'muktainagar', nameMr: 'मुक्ताईनगर (Muktainagar)', nameEn: 'Muktainagar', villages: [{ nameMr: 'कुऱ्हा', nameEn: 'Kurha' }] },
      { id: 'bodwad', nameMr: 'बोधवड (Bodwad)', nameEn: 'Bodwad', villages: [{ nameMr: 'वरखेड', nameEn: 'Varkhed' }] },
      { id: 'bhadgaon', nameMr: 'भडगाव (Bhadgaon)', nameEn: 'Bhadgaon', villages: [{ nameMr: 'कजगाव', nameEn: 'Kajgaon' }] },
    ]
  },
  {
    id: 'dhule',
    nameMr: 'धुळे (Dhule)',
    nameEn: 'Dhule',
    talukas: [
      { id: 'dhule_t', nameMr: 'धुळे (Dhule)', nameEn: 'Dhule', villages: [{ nameMr: 'मोहाडी', nameEn: 'Mohadi' }, { nameMr: 'कुसुंबा', nameEn: 'Kusumba' }] },
      { id: 'sakri', nameMr: 'साक्री (Sakri)', nameEn: 'Sakri', villages: [{ nameMr: 'निझामपूर', nameEn: 'Nizhampur' }, { nameMr: 'पिंपळनेर', nameEn: 'Pimpalner' }] },
      { id: 'shirpur', nameMr: 'शिरपूर (Shirpur)', nameEn: 'Shirpur', villages: [{ nameMr: 'थाळनेर', nameEn: 'Thalner' }, { nameMr: 'बोराडी', nameEn: 'Boradi' }] },
      { id: 'sindkheda', nameMr: 'शिंदखेडा (Sindkheda)', nameEn: 'Sindkheda', villages: [{ nameMr: 'दोंडाईचा', nameEn: 'Dondaicha' }, { nameMr: 'नरडाणा', nameEn: 'Nardana' }] },
    ]
  },
  {
    id: 'nandurbar',
    nameMr: 'नंदुरबार (Nandurbar)',
    nameEn: 'Nandurbar',
    talukas: [
      { id: 'nandurbar_t', nameMr: 'नंदुरबार (Nandurbar)', nameEn: 'Nandurbar', villages: [{ nameMr: 'कोपर्ली', nameEn: 'Koparli' }, { nameMr: 'खांडबारा', nameEn: 'Khandbara' }] },
      { id: 'navapur', nameMr: 'नवापूर (Navapur)', nameEn: 'Navapur', villages: [{ nameMr: 'चिंचापाडा', nameEn: 'Chinchapada' }] },
      { id: 'shahada', nameMr: 'शहादा (Shahada)', nameEn: 'Shahada', villages: [{ nameMr: 'म्हसावद', nameEn: 'Mhasawad' }, { nameMr: 'प्रकाशा', nameEn: 'Prakasha' }] },
      { id: 'taloda', nameMr: 'तळोदा (Taloda)', nameEn: 'Taloda', villages: [{ nameMr: 'बोरद', nameEn: 'Borad' }] },
      { id: 'akkalkuwa', nameMr: 'अक्कलकुवा (Akkalkuwa)', nameEn: 'Akkalkuwa', villages: [{ nameMr: 'खापर', nameEn: 'Khapar' }] },
      { id: 'dhadgaon', nameMr: 'धडगाव - अक्रानी (Dhadgaon)', nameEn: 'Dhadgaon', aliases: ['Akrani'], villages: [{ nameMr: 'तोरणमाळ', nameEn: 'Toranmal' }] },
    ]
  },
  {
    id: 'thane',
    nameMr: 'ठाणे (Thane)',
    nameEn: 'Thane',
    talukas: [
      { id: 'thane_t', nameMr: 'ठाणे (Thane)', nameEn: 'Thane', villages: [{ nameMr: 'माजिवाडा', nameEn: 'Majiwada' }] },
      { id: 'kalyan', nameMr: 'कल्याण (Kalyan)', nameEn: 'Kalyan', villages: [{ nameMr: 'टिटवाळा', nameEn: 'Titwala' }, { nameMr: 'खडकपाडा', nameEn: 'Khadakpada' }] },
      { id: 'bhiwandi', nameMr: 'भिवंडी (Bhiwandi)', nameEn: 'Bhiwandi', villages: [{ nameMr: 'पडघा', nameEn: 'Padgha' }, { nameMr: 'अंजूरबापदेव', nameEn: 'Anjur' }] },
      { id: 'ulhasnagar', nameMr: 'उल्हासनगर (Ulhasnagar)', nameEn: 'Ulhasnagar', villages: [{ nameMr: 'शहाड', nameEn: 'Shahad' }] },
      { id: 'murbad', nameMr: 'मुरबाड (Murbad)', nameEn: 'Murbad', villages: [{ nameMr: 'धसई', nameEn: 'Dhasai' }, { nameMr: 'शिवळे', nameEn: 'Shivale' }] },
      { id: 'shahapur', nameMr: 'शहापूर (Shahapur)', nameEn: 'Shahapur', villages: [{ nameMr: 'आसनगाव', nameEn: 'Asangaon' }, { nameMr: 'वासिंद', nameEn: 'Vasind' }] },
    ]
  },
  {
    id: 'palghar',
    nameMr: 'पालघर (Palghar)',
    nameEn: 'Palghar',
    talukas: [
      { id: 'palghar_t', nameMr: 'पालघर (Palghar)', nameEn: 'Palghar', villages: [{ nameMr: 'बोईसर', nameEn: 'Boisar' }, { nameMr: 'सफाळे', nameEn: 'Saphale' }] },
      { id: 'vasai', nameMr: 'वसई (Vasai)', nameEn: 'Vasai', villages: [{ nameMr: 'नालासोपारा', nameEn: 'Nalasopara' }, { nameMr: 'विरार', nameEn: 'Virar' }] },
      { id: 'dahanu', nameMr: 'डहाणू (Dahanu)', nameEn: 'Dahanu', villages: [{ nameMr: 'वाणगाव', nameEn: 'Vangaon' }, { nameMr: 'बोर्डी', nameEn: 'Bordi' }] },
      { id: 'wada', nameMr: 'वाडा (Wada)', nameEn: 'Wada', villages: [{ nameMr: 'कुडूस', nameEn: 'Kudus' }, { nameMr: 'खानिवली', nameEn: 'Khanivali' }] },
      { id: 'jawhar', nameMr: 'जव्हार (Jawhar)', nameEn: 'Jawhar', villages: [{ nameMr: 'झाप', nameEn: 'Jhap' }] },
      { id: 'mokhada', nameMr: 'मोखाडा (Mokhada)', nameEn: 'Mokhada', villages: [{ nameMr: 'खोडाळा', nameEn: 'Khodala' }] },
      { id: 'talasari', nameMr: 'तलासरी (Talasari)', nameEn: 'Talasari', villages: [{ nameMr: 'संजान जवळ', nameEn: 'Near Sanjan' }] },
      { id: 'vikramgad', nameMr: 'विक्रमगड (Vikramgad)', nameEn: 'Vikramgad', villages: [{ nameMr: 'ओंदे', nameEn: 'Onde' }] },
    ]
  },
  {
    id: 'raigad',
    nameMr: 'रायगड (Raigad)',
    nameEn: 'Raigad',
    aliases: ['Alibag'],
    talukas: [
      { id: 'alibag', nameMr: 'अलिबाग (Alibag)', nameEn: 'Alibag', villages: [{ nameMr: 'चौल', nameEn: 'Chaul' }, { nameMr: 'रेवदंडा', nameEn: 'Revdanda' }, { nameMr: 'मांडवा', nameEn: 'Mandwa' }] },
      { id: 'panvel', nameMr: 'पनवेल (Panvel)', nameEn: 'Panvel', villages: [{ nameMr: 'तळोजा', nameEn: 'Taloja' }, { nameMr: 'कामोठे', nameEn: 'Kamothe' }] },
      { id: 'karjat_r', nameMr: 'कर्जत (Karjat)', nameEn: 'Karjat', villages: [{ nameMr: 'नेरळ', nameEn: 'Neral' }, { nameMr: 'कशेळे', nameEn: 'Kashele' }] },
      { id: 'khalapur', nameMr: 'खालापूर (Khalapur)', nameEn: 'Khalapur', villages: [{ nameMr: 'खोपोली', nameEn: 'Khopoli' }, { nameMr: 'चौक', nameEn: 'Chauk' }] },
      { id: 'pen', nameMr: 'पेण (Pen)', nameEn: 'Pen', villages: [{ nameMr: 'वडखळ', nameEn: 'Vadkhal' }] },
      { id: 'uran', nameMr: 'उरण (Uran)', nameEn: 'Uran', villages: [{ nameMr: 'द्रोणागिरी', nameEn: 'Dronagiri' }] },
      { id: 'mahad', nameMr: 'महाड (Mahad)', nameEn: 'Mahad', villages: [{ nameMr: 'बिरवाडी', nameEn: 'Birwadi' }, { nameMr: 'नाते', nameEn: 'Nate' }] },
      { id: 'mangaon', nameMr: 'मानगाव (Mangaon)', nameEn: 'Mangaon', villages: [{ nameMr: 'इंदापूर', nameEn: 'Indapur' }, { nameMr: 'निजामपूर', nameEn: 'Nizhampur' }] },
      { id: 'roha', nameMr: 'रोहा (Roha)', nameEn: 'Roha', villages: [{ nameMr: 'कोलाड', nameEn: 'Kolad' }, { nameMr: 'धाटाव', nameEn: 'Dhataw' }] },
      { id: 'shrivardhan', nameMr: 'श्रीवर्धन (Shrivardhan)', nameEn: 'Shrivardhan', villages: [{ nameMr: 'दिवेआगर', nameEn: 'Diveagar' }, { nameMr: 'हरिहरेश्वर', nameEn: 'Harihareshwar' }] },
      { id: 'tala', nameMr: 'तळा (Tala)', nameEn: 'Tala', villages: [{ nameMr: 'तळा गाव', nameEn: 'Tala Gaon' }] },
      { id: 'mhasla', nameMr: 'म्हसळा (Mhasla)', nameEn: 'Mhasla', villages: [{ nameMr: 'वरवठणे', nameEn: 'Varvathane' }] },
      { id: 'poladpur', nameMr: 'पोलादपूर (Poladpur)', nameEn: 'Poladpur', villages: [{ nameMr: 'कशेडी', nameEn: 'Kashedi' }] },
      { id: 'murud', nameMr: 'मुरुड (Murud)', nameEn: 'Murud', villages: [{ nameMr: 'काशीद', nameEn: 'Kashid' }, { nameMr: 'मुरुड जंजिरा', nameEn: 'Murud Janjira' }] },
    ]
  },
  {
    id: 'ratnagiri',
    nameMr: 'रत्नागिरी (Ratnagiri)',
    nameEn: 'Ratnagiri',
    talukas: [
      { id: 'ratnagiri_t', nameMr: 'रत्नागिरी (Ratnagiri)', nameEn: 'Ratnagiri', villages: [{ nameMr: 'मालगुंड', nameEn: 'Malgund' }, { nameMr: 'गणपतीपुळे', nameEn: 'Ganpatipule' }, { nameMr: 'पावस', nameEn: 'Pawas' }] },
      { id: 'chiplun', nameMr: 'चिपळूण (Chiplun)', nameEn: 'Chiplun', villages: [{ nameMr: 'अलोरे', nameEn: 'Alore' }, { nameMr: 'रामपूर', nameEn: 'Rampur' }] },
      { id: 'khed_r', nameMr: 'खेड (Khed)', nameEn: 'Khed', villages: [{ nameMr: 'भरणे नाका', nameEn: 'Bharne Naka' }, { nameMr: 'लोटे', nameEn: 'Lote' }] },
      { id: 'guhagar', nameMr: 'गुहागर (Guhagar)', nameEn: 'Guhagar', villages: [{ nameMr: 'शृंगारतळी', nameEn: 'Shringartali' }, { nameMr: 'हेडवी', nameEn: 'Hedvi' }] },
      { id: 'dapoli', nameMr: 'दापोली (Dapoli)', nameEn: 'Dapoli', villages: [{ nameMr: 'हर्णै', nameEn: 'Harnai' }, { nameMr: 'आंजर्ले', nameEn: 'Anjarle' }] },
      { id: 'sangameshwar', nameMr: 'संगमेश्वर (Sangameshwar)', nameEn: 'Sangameshwar', aliases: ['Devrukh'], villages: [{ nameMr: 'देवरूख', nameEn: 'Devrukh' }, { nameMr: 'माखजन', nameEn: 'Makhajan' }] },
      { id: 'rajapur', nameMr: 'राजापूर (Rajapur)', nameEn: 'Rajapur', villages: [{ nameMr: 'जैतापूर', nameEn: 'Jaitapur' }, { nameMr: 'ओणी', nameEn: 'Oni' }] },
      { id: 'mandangad', nameMr: 'मंडणगड (Mandangad)', nameEn: 'Mandangad', villages: [{ nameMr: 'म्हाप्रळ', nameEn: 'Mhapral' }] },
      { id: 'lanja', nameMr: 'लांजा (Lanja)', nameEn: 'Lanja', villages: [{ nameMr: 'कोराळे', nameEn: 'Korale' }] },
    ]
  },
  {
    id: 'sindhudurg',
    nameMr: 'सिंधुदुर्ग (Sindhudurg)',
    nameEn: 'Sindhudurg',
    aliases: ['Oros'],
    talukas: [
      { id: 'kankavli', nameMr: 'कणकवली (Kankavli)', nameEn: 'Kankavli', villages: [{ nameMr: 'नांदगाव', nameEn: 'Nandgaon' }, { nameMr: 'खारेपाटण', nameEn: 'Kharepatan' }] },
      { id: 'sawantwadi', nameMr: 'सावंतवाडी (Sawantwadi)', nameEn: 'Sawantwadi', villages: [{ nameMr: 'आंबोली', nameEn: 'Amboli' }, { nameMr: 'बांदा', nameEn: 'Banda' }] },
      { id: 'malvan', nameMr: 'मालवण (Malvan)', nameEn: 'Malvan', villages: [{ nameMr: 'तारकर्ली', nameEn: 'Tarkarli' }, { nameMr: 'धामापूर', nameEn: 'Dhamapur' }] },
      { id: 'vengurla', nameMr: 'वेंगुर्ला (Vengurla)', nameEn: 'Vengurla', villages: [{ nameMr: 'शिरोडा', nameEn: 'Shiroda' }, { nameMr: 'रेडी', nameEn: 'Redi' }] },
      { id: 'kudal', nameMr: 'कुडाळ (Kudal)', nameEn: 'Kudal', villages: [{ nameMr: 'ओरोस', nameEn: 'Oros' }, { nameMr: 'माणगाव', nameEn: 'Mangaon' }] },
      { id: 'devgad', nameMr: 'देवगड (Devgad)', nameEn: 'Devgad', villages: [{ nameMr: 'जामसंडे', nameEn: 'Jamsande' }, { nameMr: 'मीठबाव', nameEn: 'Mithbav' }] },
      { id: 'vaibhavwadi', nameMr: 'वैभववाडी (Vaibhavwadi)', nameEn: 'Vaibhavwadi', villages: [{ nameMr: 'भुईबावडा', nameEn: 'Bhuibawada' }] },
      { id: 'dodamarg', nameMr: 'दोडामार्ग (Dodamarg)', nameEn: 'Dodamarg', villages: [{ nameMr: 'भेडी', nameEn: 'Bhedshi' }] },
    ]
  },
  {
    id: 'wardha',
    nameMr: 'वर्धा (Wardha)',
    nameEn: 'Wardha',
    talukas: [
      { id: 'wardha_t', nameMr: 'वर्धा (Wardha)', nameEn: 'Wardha', villages: [{ nameMr: 'सेवाग्राम', nameEn: 'Sevagram' }, { nameMr: 'पवनार', nameEn: 'Pawnar' }] },
      { id: 'hinganghat', nameMr: 'हिंगणघाट (Hinganghat)', nameEn: 'Hinganghat', villages: [{ nameMr: 'वडनेर', nameEn: 'Vadner' }, { nameMr: 'कानगाव', nameEn: 'Kangaon' }] },
      { id: 'arvi', nameMr: 'आर्वी (Arvi)', nameEn: 'Arvi', villages: [{ nameMr: 'रोहणा', nameEn: 'Rohana' }, { nameMr: 'खडकी', nameEn: 'Khadki' }] },
      { id: 'deoli', nameMr: 'देवळी (Deoli)', nameEn: 'Deoli', villages: [{ nameMr: 'अंजी', nameEn: 'Anji' }, { nameMr: 'भिडी', nameEn: 'Bhidi' }] },
      { id: 'seloo', nameMr: 'सेलू (Seloo)', nameEn: 'Seloo', villages: [{ nameMr: 'झडशी', nameEn: 'Jhadshi' }] },
      { id: 'samudrapur', nameMr: 'समुद्रपूर (Samudrapur)', nameEn: 'Samudrapur', villages: [{ nameMr: 'गिरड', nameEn: 'Girad' }] },
      { id: 'karanja_v', nameMr: 'कारंजा (Karanja)', nameEn: 'Karanja', villages: [{ nameMr: 'थाणेगाव', nameEn: 'Thanegaon' }] },
      { id: 'ashti_w', nameMr: 'आष्टी (Ashti)', nameEn: 'Ashti', villages: [{ nameMr: 'तळेगाव', nameEn: 'Talegaon' }] },
    ]
  },
  {
    id: 'nagpur',
    nameMr: 'नागपूर (Nagpur)',
    nameEn: 'Nagpur',
    talukas: [
      { id: 'nagpur_urban', nameMr: 'नागपूर शहर (Nagpur Urban)', nameEn: 'Nagpur Urban', villages: [{ nameMr: 'सीताबर्डी', nameEn: 'Sitabuldi' }] },
      { id: 'nagpur_rural', nameMr: 'नागपूर ग्रामीण (Nagpur Rural)', nameEn: 'Nagpur Rural', villages: [{ nameMr: 'वाडी', nameEn: 'Wadi' }, { nameMr: 'बुटीबोरी', nameEn: 'Butibori' }] },
      { id: 'kamptee', nameMr: 'कामठी (Kamptee)', nameEn: 'Kamptee', villages: [{ nameMr: 'कन्हान', nameEn: 'Kanhan' }] },
      { id: 'hingna', nameMr: 'हिंगणा (Hingna)', nameEn: 'Hingna', villages: [{ nameMr: 'वायनाड', nameEn: 'Wynaad' }, { nameMr: 'रायपूर', nameEn: 'Raipur' }] },
      { id: 'katol', nameMr: 'काटोल (Katol)', nameEn: 'Katol', villages: [{ nameMr: 'कोंढाळी', nameEn: 'Kondhali' }] },
      { id: 'kalameshwar', nameMr: 'कलमेश्वर (Kalameshwar)', nameEn: 'Kalameshwar', villages: [{ nameMr: 'ब्राह्मणी', nameEn: 'Brahmani' }] },
      { id: 'savner', nameMr: 'सावनेर (Savner)', nameEn: 'Savner', villages: [{ nameMr: 'खापरखेडा', nameEn: 'Khaperkheda' }, { nameMr: 'कोराडी', nameEn: 'Koradi' }] },
      { id: 'ramtek', nameMr: 'रामटेक (Ramtek)', nameEn: 'Ramtek', villages: [{ nameMr: 'मनसर', nameEn: 'Mansar' }] },
      { id: 'parseoni', nameMr: 'पारशिवनी (Parseoni)', nameEn: 'Parseoni', villages: [{ nameMr: 'कांद्री', nameEn: 'Kandri' }] },
      { id: 'umred', nameMr: 'उमरेड (Umred)', nameEn: 'Umred', villages: [{ nameMr: 'सिरी', nameEn: 'Siri' }] },
      { id: 'kuhi', nameMr: 'कुही (Kuhi)', nameEn: 'Kuhi', villages: [{ nameMr: 'मांढळ', nameEn: 'Mandhal' }] },
      { id: 'bhiwapur', nameMr: 'भिवापूर (Bhiwapur)', nameEn: 'Bhiwapur', villages: [{ nameMr: 'तास', nameEn: 'Tas' }] },
      { id: 'narkhed', nameMr: 'नरखेड (Narkhed)', nameEn: 'Narkhed', villages: [{ nameMr: 'मोगरखेड', nameEn: 'Mogarkhed' }] },
      { id: 'mauda', nameMr: 'मौदा (Mauda)', nameEn: 'Mauda', villages: [{ nameMr: 'तारसा', nameEn: 'Tarsa' }] },
    ]
  },
  {
    id: 'bhandara',
    nameMr: 'भंडारा (Bhandara)',
    nameEn: 'Bhandara',
    talukas: [
      { id: 'bhandara_t', nameMr: 'भंडारा (Bhandara)', nameEn: 'Bhandara', villages: [{ nameMr: 'वरठी', nameEn: 'Varthi' }, { nameMr: 'कारधा', nameEn: 'Kardha' }] },
      { id: 'tumsar', nameMr: 'तुमसर (Tumsar)', nameEn: 'Tumsar', villages: [{ nameMr: 'सिहोरा', nameEn: 'Sihora' }] },
      { id: 'mohadi', nameMr: 'मोहाडी (Mohadi)', nameEn: 'Mohadi', villages: [{ nameMr: 'वरघड', nameEn: 'Varghad' }] },
      { id: 'pauni', nameMr: 'पवनी (Pauni)', nameEn: 'Pauni', villages: [{ nameMr: 'अड्याळ', nameEn: 'Adyal' }] },
      { id: 'sakoli', nameMr: 'साकोली (Sakoli)', nameEn: 'Sakoli', villages: [{ nameMr: 'सेंदूरवाफा', nameEn: 'Sendurwafa' }] },
      { id: 'lakhani', nameMr: 'लाखाणी (Lakhani)', nameEn: 'Lakhani', villages: [{ nameMr: 'पिंपळगाव', nameEn: 'Pimpalgaon' }] },
      { id: 'lakhandur', nameMr: 'लाखांदूर (Lakhandur)', nameEn: 'Lakhandur', villages: [{ nameMr: 'मासळ', nameEn: 'Masal' }] },
    ]
  },
  {
    id: 'gondia',
    nameMr: 'गोंदिया (Gondia)',
    nameEn: 'Gondia',
    talukas: [
      { id: 'gondia_t', nameMr: 'गोंदिया (Gondia)', nameEn: 'Gondia', villages: [{ nameMr: 'कुडवा', nameEn: 'Kudwa' }, { nameMr: 'रावनवाडी', nameEn: 'Ravanwadi' }] },
      { id: 'tirora', nameMr: 'तिरोडा (Tirora)', nameEn: 'Tirora', villages: [{ nameMr: 'मुंडिकोटा', nameEn: 'Mundikota' }] },
      { id: 'goregaon_g', nameMr: 'गोरेगाव (Goregaon)', nameEn: 'Goregaon', villages: [{ nameMr: 'कु्हाडी', nameEn: 'Kurhadi' }] },
      { id: 'arjuni_morgaon', nameMr: 'अर्जुनी मोरगाव (Arjuni Morgaon)', nameEn: 'Arjuni Morgaon', villages: [{ nameMr: 'नवेगाव बांध', nameEn: 'Navegaon Bandh' }] },
      { id: 'amgaon', nameMr: 'आमगाव (Amgaon)', nameEn: 'Amgaon', villages: [{ nameMr: 'पदमापूर', nameEn: 'Padmapur' }] },
      { id: 'salekasa', nameMr: 'सालेकसा (Salekasa)', nameEn: 'Salekasa', villages: [{ nameMr: 'दरेकसा', nameEn: 'Darekasa' }] },
      { id: 'deori', nameMr: 'देवरी (Deori)', nameEn: 'Deori', villages: [{ nameMr: 'चिचगड', nameEn: 'Chichgad' }] },
      { id: 'sadak_arjuni', nameMr: 'सडक अर्जुनी (Sadak Arjuni)', nameEn: 'Sadak Arjuni', villages: [{ nameMr: 'डोंगरगाव', nameEn: 'Dongargaon' }] },
    ]
  },
  {
    id: 'chandrapur',
    nameMr: 'चंद्रपूर (Chandrapur)',
    nameEn: 'Chandrapur',
    talukas: [
      { id: 'chandrapur_t', nameMr: 'चंद्रपूर (Chandrapur)', nameEn: 'Chandrapur', villages: [{ nameMr: 'पडोळी', nameEn: 'Padoli' }, { nameMr: 'घुग्घुस', nameEn: 'Ghuggus' }] },
      { id: 'warora', nameMr: 'वरोरा (Warora)', nameEn: 'Warora', villages: [{ nameMr: 'आनंदवन', nameEn: 'Anandwan' }, { nameMr: 'माढेळी', nameEn: 'Madheli' }] },
      { id: 'bhadrawati', nameMr: 'भद्रावती (Bhadrawati)', nameEn: 'Bhadrawati', villages: [{ nameMr: 'माजरी', nameEn: 'Majri' }] },
      { id: 'chimur', nameMr: 'चिमूर (Chimur)', nameEn: 'Chimur', villages: [{ nameMr: 'नेरी', nameEn: 'Neri' }, { nameMr: 'खांबाडा', nameEn: 'Khambada' }] },
      { id: 'nagbhir', nameMr: 'नागभीड (Nagbhir)', nameEn: 'Nagbhir', villages: [{ nameMr: 'तळोधी', nameEn: 'Talodhi' }] },
      { id: 'brahmapuri', nameMr: 'ब्रह्मपुरी (Brahmapuri)', nameEn: 'Brahmapuri', villages: [{ nameMr: 'गांगळवाडी', nameEn: 'Gangalwadi' }] },
      { id: 'sindewahi', nameMr: 'सिंदेवाही (Sindewahi)', nameEn: 'Sindewahi', villages: [{ nameMr: 'नवरगाव', nameEn: 'Navargaon' }] },
      { id: 'mul', nameMr: 'मूल (Mul)', nameEn: 'Mul', villages: [{ nameMr: 'मारोडा', nameEn: 'Maroda' }] },
      { id: 'saoli', nameMr: 'सावली (Saoli)', nameEn: 'Saoli', villages: [{ nameMr: 'व्याहाड', nameEn: 'Vyahad' }] },
      { id: 'rajura', nameMr: 'राजूरा (Rajura)', nameEn: 'Rajura', villages: [{ nameMr: 'गडचांदूर', nameEn: 'Gadchandur' }] },
      { id: 'korpana', nameMr: 'कोरपना (Korpana)', nameEn: 'Korpana', villages: [{ nameMr: 'अमळनाला', nameEn: 'Amalnala' }] },
      { id: 'jiwati', nameMr: 'जिवती (Jiwati)', nameEn: 'Jiwati', villages: [{ nameMr: 'टेकामांडवा', nameEn: 'Tekamandwa' }] },
      { id: 'ballarpur', nameMr: 'बल्लारपूर (Ballarpur)', nameEn: 'Ballarpur', villages: [{ nameMr: 'बाामणी', nameEn: 'Bamani' }] },
      { id: 'pombhurna', nameMr: 'पोंभुर्णा (Pombhurna)', nameEn: 'Pombhurna', villages: [{ nameMr: 'देवाडा', nameEn: 'Dewada' }] },
      { id: 'gondpipri', nameMr: 'गोंडपिपरी (Gondpipri)', nameEn: 'Gondpipri', villages: [{ nameMr: 'धाबा', nameEn: 'Dhaba' }] },
    ]
  },
  {
    id: 'gadchiroli',
    nameMr: 'गडचिरोली (Gadchiroli)',
    nameEn: 'Gadchiroli',
    talukas: [
      { id: 'gadchiroli_t', nameMr: 'गडचिरोली (Gadchiroli)', nameEn: 'Gadchiroli', villages: [{ nameMr: 'पोटेगाव', nameEn: 'Potegaon' }, { nameMr: 'मारकांडा', nameEn: 'Markanda' }] },
      { id: 'armori', nameMr: 'आरमोरी (Armori)', nameEn: 'Armori', villages: [{ nameMr: 'वैरागड', nameEn: 'Vairagad' }] },
      { id: 'chamorshi', nameMr: 'चामोर्शी (Chamorshi)', nameEn: 'Chamorshi', villages: [{ nameMr: 'आष्टी', nameEn: 'Ashti' }] },
      { id: 'kurkheda', nameMr: 'कुरखेडा (Kurkheda)', nameEn: 'Kurkheda', villages: [{ nameMr: 'गोठणगाव', nameEn: 'Gothangaon' }] },
      { id: 'dhanora', nameMr: 'धानोरा (Dhanora)', nameEn: 'Dhanora', villages: [{ nameMr: 'चातगाव', nameEn: 'Chatgaon' }] },
      { id: 'aheri', nameMr: 'अहेरी (Aheri)', nameEn: 'Aheri', villages: [{ nameMr: 'कमलापूर', nameEn: 'Kamalapur' }] },
      { id: 'etapalli', nameMr: 'एटापल्ली (Etapalli)', nameEn: 'Etapalli', villages: [{ nameMr: 'कसनसूर', nameEn: 'Kasansur' }] },
      { id: 'sironcha', nameMr: 'सिरोंचा (Sironcha)', nameEn: 'Sironcha', villages: [{ nameMr: 'झिंगानूर', nameEn: 'Jinganur' }] },
      { id: 'mulchera', nameMr: 'मुलचेरा (Mulchera)', nameEn: 'Mulchera', villages: [{ nameMr: 'हेदरी', nameEn: 'Hedri' }] },
      { id: 'bhamragad', nameMr: 'भामरागड (Bhamragad)', nameEn: 'Bhamragad', villages: [{ nameMr: 'हेमलकसा', nameEn: 'Hemalkasa' }] },
      { id: 'korchi', nameMr: 'कोरची (Korchi)', nameEn: 'Korchi', villages: [{ nameMr: 'कोटगुल', nameEn: 'Kotgul' }] },
      { id: 'desaiganj', nameMr: 'देसाईगंज - वडसा (Desaiganj)', nameEn: 'Desaiganj', aliases: ['Vadasa'], villages: [{ nameMr: 'वडसा', nameEn: 'Vadasa' }, { nameMr: 'विसापूर', nameEn: 'Visapur' }] },
    ]
  },
  {
    id: 'mumbai_city',
    nameMr: 'मुंबई शहर (Mumbai City)',
    nameEn: 'Mumbai City',
    talukas: [
      { id: 'mumbai_city_t', nameMr: 'मुंबई शहर (Mumbai City)', nameEn: 'Mumbai City', villages: [{ nameMr: 'दादर', nameEn: 'Dadar' }, { nameMr: 'भायखळा', nameEn: 'Byculla' }] }
    ]
  },
  {
    id: 'mumbai_suburban',
    nameMr: 'मुंबई उपनगर (Mumbai Suburban)',
    nameEn: 'Mumbai Suburban',
    talukas: [
      { id: 'kurla', nameMr: 'कुर्ला (Kurla)', nameEn: 'Kurla', villages: [{ nameMr: 'कुर्ला', nameEn: 'Kurla' }, { nameMr: 'घाटकोपर', nameEn: 'Ghatkopar' }] },
      { id: 'andheri', nameMr: 'अंधेरी (Andheri)', nameEn: 'Andheri', villages: [{ nameMr: 'अंधेरी', nameEn: 'Andheri' }, { nameMr: 'बांद्रा', nameEn: 'Bandra' }] },
      { id: 'borivali', nameMr: 'बोरीवली (Borivali)', nameEn: 'Borivali', villages: [{ nameMr: 'बोरीवली', nameEn: 'Borivali' }, { nameMr: 'मालाड', nameEn: 'Malad' }] }
    ]
  }
];

// Helper utilities for Searching and Lookup
export function searchDistricts(query: string): DistrictInfo[] {
  if (!query.trim()) return MAHARASHTRA_DISTRICTS;
  const q = query.toLowerCase().trim();
  return MAHARASHTRA_DISTRICTS.filter((d) => {
    if (d.nameMr.toLowerCase().includes(q) || d.nameEn.toLowerCase().includes(q)) return true;
    if (d.aliases && d.aliases.some((a) => a.toLowerCase().includes(q))) return true;
    return false;
  });
}

export function findDistrict(districtNameOrId: string): DistrictInfo | undefined {
  if (!districtNameOrId) return undefined;
  const target = districtNameOrId.toLowerCase().trim();
  return MAHARASHTRA_DISTRICTS.find(
    (d) =>
      d.id === target ||
      d.nameEn.toLowerCase() === target ||
      d.nameMr.toLowerCase().includes(target) ||
      (d.aliases && d.aliases.some((a) => a.toLowerCase() === target))
  );
}

export function searchTalukas(districtNameOrId: string, query: string): TalukaInfo[] {
  const district = findDistrict(districtNameOrId);
  if (!district) return [];
  if (!query.trim()) return district.talukas;
  const q = query.toLowerCase().trim();
  return district.talukas.filter((t) => {
    if (t.nameMr.toLowerCase().includes(q) || t.nameEn.toLowerCase().includes(q)) return true;
    if (t.aliases && t.aliases.some((a) => a.toLowerCase().includes(q))) return true;
    return false;
  });
}

export function findTaluka(districtNameOrId: string, talukaNameOrId: string): TalukaInfo | undefined {
  const district = findDistrict(districtNameOrId);
  if (!district) return undefined;
  const target = talukaNameOrId.toLowerCase().trim();
  return district.talukas.find(
    (t) =>
      t.id === target ||
      t.nameEn.toLowerCase() === target ||
      t.nameMr.toLowerCase().includes(target) ||
      (t.aliases && t.aliases.some((a) => a.toLowerCase() === target))
  );
}

export function searchVillages(
  districtNameOrId: string,
  talukaNameOrId: string,
  query: string
): VillageInfo[] {
  const taluka = findTaluka(districtNameOrId, talukaNameOrId);
  if (!taluka) return [];
  if (!query.trim()) return taluka.villages;
  const q = query.toLowerCase().trim();
  return taluka.villages.filter(
    (v) => v.nameMr.toLowerCase().includes(q) || v.nameEn.toLowerCase().includes(q)
  );
}
