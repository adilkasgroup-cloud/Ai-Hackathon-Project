import React, { useRef, useState } from 'react';
import { Camera, Upload, Sparkles, AlertCircle, Info, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Language, SamplePhotoCase } from '../types/crop';
import { TRANSLATIONS } from '../data/translations';
import { SAMPLE_CASES } from '../data/sampleCases';

interface PhotoUploaderProps {
  currentLanguage: Language;
  onPhotoSelected: (base64Image: string, cropHint?: string, farmerNotes?: string) => void;
  onSampleCaseSelected: (sample: SamplePhotoCase) => void;
  isAnalyzing: boolean;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  currentLanguage,
  onPhotoSelected,
  onSampleCaseSelected,
  isAnalyzing,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedCrop, setSelectedCrop] = useState<string>('Maize');
  const [farmerNotes, setFarmerNotes] = useState<string>('');
  const [showOptionalFields, setShowOptionalFields] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onPhotoSelected(result, selectedCrop, farmerNotes);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const cropOptions = [
    { id: 'Maize', en: 'Maize', ny: 'Chimanga', tum: 'Ngoma' },
    { id: 'Tobacco', en: 'Tobacco', ny: 'Fodya', tum: 'Hona' },
    { id: 'Groundnuts', en: 'Groundnuts', ny: 'Mtedza', tum: 'Syaba' },
    { id: 'Beans', en: 'Beans / Legumes', ny: 'Nyemba / Nandolo', tum: 'Ntchana' },
    { id: 'Cassava', en: 'Cassava', ny: 'Chinangwa', tum: 'Chinangwa' },
    { id: 'Other', en: 'Other Crop', ny: 'Mbeu Ina', tum: 'Chomela Chinyake' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-green-950 text-white rounded-3xl p-5 sm:p-7 shadow-lg shadow-emerald-950/20 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>AI Agricultural Diagnostic Tool</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
            {t.tagline}
          </h2>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            {currentLanguage === 'ny'
              ? 'Jambulani chithunzi cha tsamba, tsinde kapena ngala yodwala kuti mudziwe vuto lake mwamsanga ndi njira zoyambira zodzitetezera popanda kutaya ndalama.'
              : currentLanguage === 'tum'
              ? 'Torani chithuzi cha jani panji chomela cholwala kuti mumanye suzu yake mwaluŵiro na nthowa ziwemi zakujivikilira pambere mundanange ndalama.'
              : 'Photograph a sick leaf, stem, or cob to get an immediate diagnosis with low-risk cultural solutions and extension officer escalation.'}
          </p>
        </div>

        {/* Big accessible Primary Action Buttons */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
          {/* Camera input (optimized for smartphones with environment camera capture) */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={isAnalyzing}
            className="w-full py-4 px-5 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] text-emerald-950 font-bold text-base rounded-2xl shadow-md flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50"
          >
            <Camera className="w-6 h-6 stroke-[2.3]" />
            <span>{t.cameraBtn}</span>
          </button>

          {/* Gallery upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="w-full py-4 px-5 bg-white/15 hover:bg-white/20 active:scale-[0.98] text-white font-bold text-base rounded-2xl border border-white/25 flex items-center justify-center gap-3 transition-all cursor-pointer backdrop-blur-xs disabled:opacity-50"
          >
            <Upload className="w-5 h-5 stroke-[2.3]" />
            <span>{t.galleryBtn}</span>
          </button>
        </div>

        {/* Optional Crop Selection Toggle */}
        <div className="mt-4 pt-4 border-t border-emerald-800/80 relative z-10">
          <button
            type="button"
            onClick={() => setShowOptionalFields(!showOptionalFields)}
            className="text-xs text-emerald-200 hover:text-white flex items-center gap-1 font-medium transition-colors"
          >
            <span>
              {showOptionalFields
                ? 'Hide extra crop details'
                : 'Select crop type or add notes (optional)'}
            </span>
            <ChevronRight
              className={`w-3.5 h-3.5 transition-transform ${showOptionalFields ? 'rotate-90' : ''}`}
            />
          </button>

          {showOptionalFields && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-700/50">
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1.5">
                  {currentLanguage === 'ny'
                    ? 'Mtundu wa Mbeu:'
                    : currentLanguage === 'tum'
                    ? 'Mtundu wa Chomela:'
                    : 'Crop Type:'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {cropOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedCrop(opt.id)}
                      className={`text-[11px] py-1.5 px-2 rounded-lg font-medium border text-center transition-all ${
                        selectedCrop === opt.id
                          ? 'bg-emerald-500 text-white border-emerald-400 font-bold'
                          : 'bg-emerald-900/50 text-emerald-200 border-emerald-800 hover:bg-emerald-800/60'
                      }`}
                    >
                      {currentLanguage === 'ny'
                        ? opt.ny
                        : currentLanguage === 'tum'
                        ? opt.tum
                        : opt.en}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1.5">
                  {currentLanguage === 'ny'
                    ? 'Mfundo za m\'munda (Ngati zilipo):'
                    : currentLanguage === 'tum'
                    ? 'Mazgo gha mu munda:'
                    : 'Field observations / notes:'}
                </label>
                <input
                  type="text"
                  value={farmerNotes}
                  onChange={(e) => setFarmerNotes(e.target.value)}
                  placeholder={
                    currentLanguage === 'ny'
                      ? 'Mwachitsanzo: Zayamba sabata yatha, m\'munda wa mphanje...'
                      : currentLanguage === 'tum'
                      ? 'Mwachiyelezgero: Vikwambika sabata yamala...'
                      : 'e.g. Started after heavy rain on 4-week old crop...'
                  }
                  className="w-full text-xs px-3 py-2 bg-emerald-900/40 border border-emerald-700/70 rounded-lg text-white placeholder-emerald-300/40 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Helpful photography tips for farmers */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
              {t.photoTipsTitle}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-amber-900">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{t.photoTip1}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{t.photoTip2}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{t.photoTip3}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sample Field Photos for Instant Testing / Demo */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>{t.demoCasesTitle}</span>
            </h3>
            <p className="text-xs text-stone-500">{t.demoCasesSubtitle}</p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 hidden sm:inline-block">
            {SAMPLE_CASES.length} Preloaded Field Cases
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_CASES.map((sample) => {
            const title =
              currentLanguage === 'ny'
                ? sample.titleChichewa
                : currentLanguage === 'tum'
                ? sample.titleTumbuka
                : sample.title;
            const crop =
              currentLanguage === 'ny'
                ? sample.cropChichewa
                : currentLanguage === 'tum'
                ? sample.cropTumbuka
                : sample.crop;

            const isLowClarity = sample.category === 'unclear';

            return (
              <div
                key={sample.id}
                onClick={() => onSampleCaseSelected(sample)}
                className={`group cursor-pointer rounded-2xl border transition-all overflow-hidden bg-white hover:shadow-md ${
                  isLowClarity
                    ? 'border-rose-200 hover:border-rose-400'
                    : 'border-stone-200 hover:border-emerald-500'
                }`}
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                  <img
                    src={sample.imageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                        isLowClarity
                          ? 'bg-rose-600 text-white'
                          : 'bg-emerald-800 text-emerald-100'
                      }`}
                    >
                      {crop}
                    </span>
                  </div>
                  {isLowClarity && (
                    <div className="absolute bottom-2 right-2">
                      <span className="text-[9px] font-bold bg-rose-700 text-white px-2 py-0.5 rounded shadow-xs">
                        Escalation Demo
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h4 className="text-xs font-bold text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                    {title}
                  </h4>
                  <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-snug">
                    {sample.previewDescription}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-emerald-700">
                    <span>Try this sample</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
