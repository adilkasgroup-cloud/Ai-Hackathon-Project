import React, { useState, useEffect } from 'react';
import {
  Dna,
  BookOpen,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Search,
  FlaskConical,
  Activity,
  Layers,
} from 'lucide-react';
import { Language } from '../types/crop';

interface BioscienceWorkbenchProps {
  currentLanguage: Language;
}

export const BioscienceWorkbench: React.FC<BioscienceWorkbenchProps> = ({ currentLanguage }) => {
  const [selectedPathogen, setSelectedPathogen] = useState<string>('spodoptera frugiperda');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const pathogensList = [
    {
      id: 'spodoptera frugiperda',
      label: 'Fall Armyworm (Spodoptera frugiperda)',
      crop: 'Maize & Sorghum Pest',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      id: 'maize streak virus',
      label: 'Maize Streak Virus (MSV)',
      crop: 'Viral Foliage Pathogen',
      color: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'cercospora nicotianae',
      label: 'Frog-Eye Leaf Spot (Cercospora nicotianae)',
      crop: 'Tobacco Fungal Pathogen',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
    },
  ];

  const fetchProfile = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/science/pathogen-profile?query=${encodeURIComponent(query)}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile(selectedPathogen);
  }, [selectedPathogen]);

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden animate-in fade-in duration-300 space-y-6 p-6">
      {/* Workbench Header */}
      <div className="border-b border-stone-100 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 shrink-0">
              <Dna className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-stone-900">
                  Bioscience & Pathogen Genomics Workbench
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  Science Skills
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Molecular biology, UniProt protein targets, PubChem bio-rational active compounds, and peer-reviewed literature.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
            <span>Powered by UniProtKB, PubChem & Europe PMC</span>
          </div>
        </div>

        {/* Quick-try example pills bar (mandated by Science Design System) */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase shrink-0">Select Organism:</span>
          {pathogensList.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPathogen(p.id)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedPathogen === p.id
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
              }`}
            >
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-stone-500 text-xs">
          Loading molecular taxonomy and UniProt protein records...
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Organism Overview & Taxonomy */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                  Organism Classification
                </span>
                <h3 className="text-lg font-black text-stone-900">{data.scientificName}</h3>
                <p className="text-xs font-medium text-stone-600">{data.commonName}</p>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white border border-stone-300 text-stone-700">
                  NCBI TaxID: <strong className="text-teal-700">{data.taxonomy.ncbiTaxId}</strong>
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800">
                  {data.taxonomy.order || data.taxonomy.family}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-200/80 text-xs">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-semibold block">Phylum / Realm</span>
                <span className="font-bold text-stone-800">{data.taxonomy.phylum || data.taxonomy.realm}</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-semibold block">Family</span>
                <span className="font-bold text-stone-800">{data.taxonomy.family}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-stone-400 uppercase font-semibold block">Susceptible Host Crops</span>
                <span className="font-medium text-stone-700">{data.hostCrops.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Section 1: UniProt Target Proteins & Receptors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-teal-700" />
                <span>UniProt Protein Targets & Virulence Factors</span>
              </h4>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                [UniProtKB Verified]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.targetProteins.map((protein: any, idx: number) => (
                <div key={idx} className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-stone-900">{protein.name}</span>
                    <a
                      href={`https://www.uniprot.org/uniprotkb/${protein.uniprotId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono font-bold text-teal-700 hover:underline flex items-center gap-0.5 bg-teal-50 px-2 py-0.5 rounded"
                    >
                      <span>{protein.uniprotId}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{protein.function}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: PubChem Bio-rational Active Compounds & Mode of Action */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                <span>PubChem Bio-rational Active Ingredients & Biological Controls</span>
              </h4>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                [PubChem Compound]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.biologicalControls.map((comp: any, idx: number) => (
                <div key={idx} className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-emerald-950">{comp.compound}</span>
                    {comp.pubchemCid && (
                      <a
                        href={`https://pubchem.ncbi.nlm.nih.gov/compound/${comp.pubchemCid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono font-bold text-emerald-700 hover:underline flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded"
                      >
                        <span>CID: {comp.pubchemCid}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>

                  {comp.molecularFormula && (
                    <div className="text-[11px] font-mono text-stone-500">
                      Formula: <strong>{comp.molecularFormula}</strong>
                    </div>
                  )}

                  <p className="text-xs text-stone-700 leading-relaxed">
                    <strong>Mode of Action:</strong> {comp.modeOfAction}
                  </p>

                  <div className="pt-1">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      GHS / Safety: {comp.ghsRating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Europe PMC / PubMed Scientific Research */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-700" />
                <span>Europe PMC & PubMed Peer-Reviewed Field Research (Malawi)</span>
              </h4>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                [Literature Curated]
              </span>
            </div>

            <div className="space-y-2">
              {data.literatureCitations.map((lit: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <h5 className="font-bold text-stone-900 leading-snug">{lit.title}</h5>
                    <p className="text-stone-500 mt-0.5">
                      Published in {lit.source} {lit.doi && `• DOI: ${lit.doi}`}
                    </p>
                  </div>
                  {lit.doi && (
                    <a
                      href={`https://doi.org/${lit.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-white hover:bg-stone-100 text-blue-700 font-bold border border-stone-300 rounded-lg shrink-0 flex items-center gap-1 transition-colors"
                    >
                      <span>Read Paper</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
