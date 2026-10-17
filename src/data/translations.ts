import { Language } from '../types/crop';

export interface TranslationDictionary {
  appTitle: string;
  appSubtitle: string;
  tagline: string;
  forFarmersInMalawi: string;
  cameraBtn: string;
  galleryBtn: string;
  demoCasesTitle: string;
  demoCasesSubtitle: string;
  demoActiveBadge: string;
  apiKeyActiveBadge: string;
  languageSelect: string;
  photoTipsTitle: string;
  photoTip1: string;
  photoTip2: string;
  photoTip3: string;
  analyzingTitle: string;
  analyzingStep1: string;
  analyzingStep2: string;
  analyzingStep3: string;
  confidenceHigh: string;
  confidenceMedium: string;
  confidenceLow: string;
  whatAiSees: string;
  primaryDiagnosis: string;
  differentialsTitle: string;
  culturalStepsTitle: string;
  culturalStepsSubtitle: string;
  chemicalTitle: string;
  chemicalSubtitle: string;
  safetyTitle: string;
  sendToOfficerBtn: string;
  escalationRequiredBanner: string;
  escalationRecommendedBanner: string;
  listenAdviceBtn: string;
  listeningBtn: string;
  stopAudioBtn: string;
  translationReviewNotice: string;
  translationReviewBadge: string;
  extensionPortalTab: string;
  diagnoseTab: string;
  howItWorksTab: string;
  resetPhotoBtn: string;
  officerModalTitle: string;
  officerModalDesc: string;
  farmerNameLabel: string;
  farmerPhoneLabel: string;
  districtLabel: string;
  epaLabel: string;
  notesLabel: string;
  sendCaseBtn: string;
  cancelBtn: string;
  escalationSuccess: string;
  dosageScrubbedBadge: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appTitle: 'Crop Doctor Malawi',
    appSubtitle: 'Instant pest & disease diagnosis for smallholder farmers',
    tagline: 'Protect your maize, tobacco and field harvest',
    forFarmersInMalawi: 'Designed for Malawian Agriculture (EPA & Field Extension)',
    cameraBtn: 'Take Photo of Sick Crop',
    galleryBtn: 'Upload from Phone',
    demoCasesTitle: 'Or Try Sample Field Photos',
    demoCasesSubtitle: 'Tap an authentic Malawi field sample to see how diagnosis works',
    demoActiveBadge: 'Demo Mode (No API key needed)',
    apiKeyActiveBadge: 'Gemini 3.8 Flash Vision Connected',
    languageSelect: 'Language / Chilankhulo / Chiyowoyero',
    photoTipsTitle: 'Tips for best results:',
    photoTip1: 'Get close to the affected leaf, stem, or cob',
    photoTip2: 'Make sure daylight is clear and avoid blurry blur',
    photoTip3: 'Show both the damaged spot and the green area',
    analyzingTitle: 'Examining your crop photo...',
    analyzingStep1: 'Scanning leaf patterns & pest markings...',
    analyzingStep2: 'Translating diagnosis into everyday language...',
    analyzingStep3: 'Applying safety checks & dosage filters...',
    confidenceHigh: 'High Confidence',
    confidenceMedium: 'Medium Confidence',
    confidenceLow: 'Low Confidence (Review Advised)',
    whatAiSees: 'What the AI Sees in This Photo',
    primaryDiagnosis: 'Most Likely Problem',
    differentialsTitle: 'Other Possibilities Considered',
    culturalStepsTitle: 'Step 1: Low-Risk Practices (Start Here)',
    culturalStepsSubtitle: 'Safe, affordable cultural methods that protect your field without high expense',
    chemicalTitle: 'Step 2: Chemical Products (If Severe)',
    chemicalSubtitle: 'Consult licensed agro-dealers only. We do not provide chemical dosages.',
    safetyTitle: 'Health & Safety Warning',
    sendToOfficerBtn: 'Send to Extension Officer (AEDO)',
    escalationRequiredBanner: 'Action Needed: AI confidence is low or risk is severe. Please consult an extension officer before spraying.',
    escalationRecommendedBanner: 'We recommend verifying this case with your local Agricultural Extension Development Officer (AEDO).',
    listenAdviceBtn: 'Listen to Advice (Audio)',
    listeningBtn: 'Reading aloud...',
    stopAudioBtn: 'Stop Audio',
    translationReviewNotice: 'Note on language: This Chichewa and Tumbuka advice was generated with AI assistance. It is flagged for review by a native agricultural officer.',
    translationReviewBadge: 'AI Translation — Review Recommended',
    extensionPortalTab: 'Extension Officer Queue',
    diagnoseTab: 'Diagnose Crop',
    howItWorksTab: 'How AI Works',
    resetPhotoBtn: 'Examine Another Crop',
    officerModalTitle: 'Connect with an Agricultural Extension Officer',
    officerModalDesc: 'Send this photo, symptoms, and your farm details to your local EPA / AEDO officer for direct human guidance.',
    farmerNameLabel: 'Your Name (Mlimi)',
    farmerPhoneLabel: 'Phone / WhatsApp Number',
    districtLabel: 'District in Malawi',
    epaLabel: 'EPA / Extension Area (Optional)',
    notesLabel: 'Additional notes or field observations',
    sendCaseBtn: 'Submit to Extension Officer',
    cancelBtn: 'Close',
    escalationSuccess: 'Case submitted successfully! An extension officer will review your photo.',
    dosageScrubbedBadge: 'Safety Check Active: Any unverified chemical dosages were stripped for farmer safety.',
  },
  ny: {
    appTitle: 'Dokotala wa Mbeu (Malawi)',
    appSubtitle: 'Kuzindikira matenda ndi tizilombo ta mbeu kwa alimi ang\'onoang\'ono',
    tagline: 'Tetezani chimanga, fodya ndi zokolola zanu m\'munda',
    forFarmersInMalawi: 'Yopangidwira ulimi wa ku Malawi (Mabungwe a za Ulimi & AEDO)',
    cameraBtn: 'Jambulani Chithunzi cha Mbeu Yodwala',
    galleryBtn: 'Sankhani Chithunzi mu Foni',
    demoCasesTitle: 'Kapena Yesani Zithunzi Zitsanzo za m\'Munda',
    demoCasesSubtitle: 'Dinani chitsanzo cha ku munda wa m\'Malawi kuti muone mmene zimagwirira ntchito',
    demoActiveBadge: 'Mayesero (Palibe chinsinsi chofunikira)',
    apiKeyActiveBadge: 'Makina a Gemini 3.8 Flash alumikizidwa',
    languageSelect: 'Chilankhulo',
    photoTipsTitle: 'Malangizo ojambula bwino:',
    photoTip1: 'Yandikirani kwambiri tsamba, tsinde kapena ngala yodwala',
    photoTip2: 'Onetsetsani kuti dzuwa lili bwino komanso chithunzi sichikugwedezeka',
    photoTip3: 'Onetsani mbali yovulala pamodzi ndi mbali yabwino yobiriwira',
    analyzingTitle: 'Kufufuza mbeu yanu m\'chithunzichi...',
    analyzingStep1: 'Kupenda mawanga a tsamba ndi zizindikiro za tizilombo...',
    analyzingStep2: 'Kumasulira malangizo m\'Chichewa chosavuta kumva...',
    analyzingStep3: 'Kuyesa chitetezo ndi kuchotsa miyezo yosatsimikizika...',
    confidenceHigh: 'Chitsimikizo Chachikulu',
    confidenceMedium: 'Chitsimikizo Chapakati',
    confidenceLow: 'Chitsimikizo Chochepa (Funsani Katswiri)',
    whatAiSees: 'Zomwe Zawonedwa pa Chithunzichi Chokha',
    primaryDiagnosis: 'Vuto Limene Likuoneka Kwambiri',
    differentialsTitle: 'Zina Zomwe Zitha Kukhalapo',
    culturalStepsTitle: 'Gawo 1: Njira Zotetezera Popanda Mankhwala (Yambani Nazo)',
    culturalStepsSubtitle: 'Njira zotetezeka komanso zosafuna ndalama zambiri zoteteza munda wanu',
    chemicalTitle: 'Gawo 2: Mankhwala a ku Sitolo (Zikavuta Kwambiri)',
    chemicalSubtitle: 'Funsani ku masitolo ovomerezeka (Agro-dealers). Sitipereka miyezo ya mankhwala.',
    safetyTitle: 'Chenjezo la Zaumoyo ndi Chitetezo',
    sendToOfficerBtn: 'Tumizani kwa Mlangizi wa za Ulimi (AEDO)',
    escalationRequiredBanner: 'Chenjezo: Chitsimikizo n\'chochepa kapena vuto ndi loopsa. Chonde lankhulani ndi Mlangizi wa za Ulimi musanapopeze mankhwala.',
    escalationRecommendedBanner: 'Tikulimbikitsa kufunsa Mlangizi wa za Ulimi (AEDO) wa m\'dera lanu kuti atsimikizire vuto ili.',
    listenAdviceBtn: 'Mverani Malangizo (Mawu)',
    listeningBtn: 'Kuwerenga mawu...',
    stopAudioBtn: 'Lekani Kuwerenga',
    translationReviewNotice: 'Zindikirani: Malangizo a Chichewa amenewa apangidwa kudzera mu AI. Akufunika kuwunikidwa ndi akatswiri a za ulimi a m\'dziko muno.',
    translationReviewBadge: 'Kumasulira kwa AI — Kukufunika Kuwunikidwa',
    extensionPortalTab: 'Mlandu wa Alimi (AEDO)',
    diagnoseTab: 'Kuyeza Mbeu',
    howItWorksTab: 'Mmene AI Imagwirira Ntchito',
    resetPhotoBtn: 'Yezerani Mbeu Ina',
    officerModalTitle: 'Tumizani ku Ofesi ya za Ulimi (EPA / AEDO)',
    officerModalDesc: 'Tumizani chithunzichi ndi zizindikiro kwa Mlangizi wa za Ulimi wa m\'dera lanu kuti akuthandizeni munthu weniweni.',
    farmerNameLabel: 'Dzina Lanu (Mlimi)',
    farmerPhoneLabel: 'Nambala ya Foni / WhatsApp',
    districtLabel: 'Boma Lanu (District)',
    epaLabel: 'Dera la EPA / Mudzi (Mwasankha)',
    notesLabel: 'Mfundo zina kapena zimene mwaona m\'munda',
    sendCaseBtn: 'Tumizani kwa Mlangizi',
    cancelBtn: 'Tsekani',
    escalationSuccess: 'Nkhani yanu yatumizidwa bwinobwino! Mlangizi wa za Ulimi aiona mwamsanga.',
    dosageScrubbedBadge: 'Chitetezo Chokhazikika: Miyezo ya mankhwala yachotsedwa kuti alimi asamavutike ndi poizoni.',
  },
  tum: {
    appTitle: 'Dokotala wa Vyomela (Malawi)',
    appSubtitle: 'Kuvumbula nthenda na vilombo vya vyakurya ku ŵalimi ŵachokoŵachoko',
    tagline: 'Vikilirani ngoma, hona na vyakurya vinu mumunda',
    forFarmersInMalawi: 'Kwakupangikira ulimi wa mu Malawi (EPA na Ŵalara ŵa vya Ulimi)',
    cameraBtn: 'Torani Chithuzi cha Chomela Cholwala',
    galleryBtn: 'Sankhani Chithuzi mu Foni',
    demoCasesTitle: 'Panji Yezgani Vithuzi Vyakulongola vya mu Munda',
    demoCasesSubtitle: 'Finyani chakuwonelerapo cha mu Malawi kuti muwone umo vikugwilira ntchito',
    demoActiveBadge: 'Chiyezgo (Palije chinsinsi chakukhumbikwa)',
    apiKeyActiveBadge: 'Makina gha Gemini 3.8 Flash ghakulumikizgika',
    languageSelect: 'Chiyowoyero',
    photoTipsTitle: 'Ulongozgi wa umo mungajambulira makora:',
    photoTip1: 'Sendelerani chomene ku jani, chitindi panji ku ngoma yodwala',
    photoTip2: 'Woneseskani kuti ungweru wa dzuŵa ngwakukwana ndipo chithuzi chileke kusunkhunyika',
    photoTip3: 'Longorani chigaŵa chakusakazika pamoza na chigaŵa chabwino chakubiriwira',
    analyzingTitle: 'Kupenjerezga vyomela vinu mu chithuzi...',
    analyzingStep1: 'Kuwona mawanga gha pa jani na vilombo...',
    analyzingStep2: 'Kung\'anamulira ulongozgi mu Chitumbuka chipusu...',
    analyzingStep3: 'Kupima chivikiliro na kuwuskamo vipimo vyambura kutsimikizgika...',
    confidenceHigh: 'Chitsimikizgo Cha Pachanya',
    confidenceMedium: 'Chitsimikizgo Cha Pakati',
    confidenceLow: 'Chitsimikizgo Cha Pasi (Kufumba Mulara)',
    whatAiSees: 'Ivyo AI Yawona mu Chithuzi Ichi Pera',
    primaryDiagnosis: 'Suzu Yikuru Yomwe Yikuwoneka',
    differentialsTitle: 'Vinyake Ivyo Vingaŵa Nthena',
    culturalStepsTitle: 'Chigaŵa 1: Nthowa Zakujivikilira Zambura Mankhwala (Yambani na Ivi)',
    culturalStepsSubtitle: 'Nthowa ziwemi zakupusuka zakuvikilira munda kwambura kunanga ndalama zinandi',
    chemicalTitle: 'Chigaŵa 2: Mankhwala gha mu Sitolo (Para Vyafika Paheni)',
    chemicalSubtitle: 'Fumbani ku masitolo ghakuzomerezgeka (Agro-dealers). Tindapereke mapimo gha munkhwala.',
    safetyTitle: 'Chenjezgo la Umoyo na Chivikiliro',
    sendToOfficerBtn: 'Tumizgani kwa Mulara wa Vyaulimi (AEDO)',
    escalationRequiredBanner: 'Chenjezgo: Chitsimikizgo chili pasi panji suzu njikuru. Chonde fumbani ku Mulara wa vya Ulimi pambere mundapope munkhwala.',
    escalationRecommendedBanner: 'Tikuŵeyelera kuti mufumbe ku Mulara wa vya Ulimi (AEDO) mu dera linu kuti wamupani ulongozgi wakufikapo.',
    listenAdviceBtn: 'Pulikizgani Ulongozgi (Mawu)',
    listeningBtn: 'Kuŵerenga mawu...',
    stopAudioBtn: 'Lekani Kuŵerenga',
    translationReviewNotice: 'Kumbukani: Ulongozgi wa Chitumbuka uwu wapangika na AI. Ukukhumbika kuwunikika na ŵalara ŵa vya ulimi ŵa chiyowoyero ichi.',
    translationReviewBadge: 'Kung\'anamula kwa AI — Kukukhumbika Kupimika',
    extensionPortalTab: 'Milandu ya Ŵalimi (AEDO)',
    diagnoseTab: 'Pimani Chomela',
    howItWorksTab: 'Umo AI Yikugwilira Ntchito',
    resetPhotoBtn: 'Pimani Chomela Chinyake',
    officerModalTitle: 'Tumizgani ku Ofesi ya vya Ulimi (EPA / AEDO)',
    officerModalDesc: 'Tumizgani chithuzi ichi na umo munda ulili kwa Mulara wa vya Ulimi mu dera linu kuti musange wovwiri wa munthu mweneko.',
    farmerNameLabel: 'Zina Linu (Mlimi)',
    farmerPhoneLabel: 'Nambala ya Foni / WhatsApp',
    districtLabel: 'Boma Linu (District)',
    epaLabel: 'Dera la EPA / Muzgo (Mwakukhumba)',
    notesLabel: 'Vinyake ivyo mwawona mu munda',
    sendCaseBtn: 'Tumizgani kwa Mulara',
    cancelBtn: 'Jalarani',
    escalationSuccess: 'Mlandu wanu watumizgika makora! Mulara wa vya Ulimi wawonenge sono.',
    dosageScrubbedBadge: 'Chivikiliro Chakhazikika: Mapimo gha mankhwala ghawuskikamo kuti ŵalimi ŵaleke kuphya na poyizoni.',
  },
};

export const MALAWI_DISTRICTS = [
  'Balaka',
  'Blantyre',
  'Chikwawa',
  'Chiradzulu',
  'Chitipa',
  'Dedza',
  'Dowa',
  'Karonga',
  'Kasungu',
  'Likoma',
  'Lilongwe',
  'Machinga',
  'Mangochi',
  'Mchinji',
  'Mulanje',
  'Mwanza',
  'Mzimba',
  'Neno',
  'Nkhata Bay',
  'Nkhotakota',
  'Nsanje',
  'Ntcheu',
  'Ntchisi',
  'Phalombe',
  'Rumphi',
  'Salima',
  'Thyolo',
  'Zomba',
];
