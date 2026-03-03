import React, { useState, useEffect } from 'react';
import { generateVoicemailData } from './services/mockDataService';
import { analyzeVoicemails } from './services/openaiService';
import { VoicemailLog, TriageCard, AnalysisSummary, UrgencyLevel } from './types';
import { DashboardHeader } from './components/DashboardHeader';
import { RawDataTable } from './components/RawDataTable';
import { SignalCard } from './components/SignalCard';
import { RefreshCw, Play, Database, Voicemail, LayoutDashboard, CheckCircle2 } from 'lucide-react';

const HUMAN_MINUTES_PER_VOICEMAIL = 10;

const URGENCY_ORDER: Record<UrgencyLevel, number> = {
  EMERGENCY: 0,
  TODAY:     1,
  SOON:      2,
  ROUTINE:   3,
  ADMIN:     4,
};

function App() {
  const [logs, setLogs] = useState<VoicemailLog[]>([]);
  const [triageResults, setTriageResults] = useState<TriageCard[]>([]);
  const [checkedTasks, setCheckedTasks] = useState<Record<string, Record<number, boolean>>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState<AnalysisSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'raw' | 'signals'>('raw');

  useEffect(() => {
    handleRegenerateData();
  }, []);

  const handleRegenerateData = () => {
    const data = generateVoicemailData();
    setLogs(data);
    setTriageResults([]);
    setCheckedTasks({});
    setSummary(null);
    setActiveTab('raw');
  };

  const handleToggle = (voicemailId: string, taskIndex: number) => {
    setCheckedTasks(prev => {
      const current = prev[voicemailId] ?? {};
      return { ...prev, [voicemailId]: { ...current, [taskIndex]: !current[taskIndex] } };
    });
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const startTime = performance.now();

    try {
      const results = await analyzeVoicemails(logs);

      const endTime = performance.now();
      const processingTimeMs = endTime - startTime;
      const humanTimeMinutes = logs.length * HUMAN_MINUTES_PER_VOICEMAIL;
      const multiplier = (humanTimeMinutes * 60) / (processingTimeMs / 1000);

      setTriageResults(results);
      setSummary({
        totalProcessed: logs.length,
        signalsFound: results.length,
        processingTimeMs,
        humanTimeEquivalentMinutes: humanTimeMinutes,
        speedMultiplier: multiplier,
      });
      setActiveTab('signals');
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      alert(`Analysis failed: ${msg}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Sort by urgency priority, split into active and done
  const sorted = [...triageResults].sort(
    (a, b) => (URGENCY_ORDER[a.urgency] ?? 99) - (URGENCY_ORDER[b.urgency] ?? 99)
  );

  const isCardDone = (triage: TriageCard) => {
    const checks = checkedTasks[triage.voicemail_id] ?? {};
    return triage.tasks.length > 0 && triage.tasks.every((_, i) => checks[i]);
  };

  const activeCards = sorted.filter(t => !isCardDone(t));
  const doneCards   = sorted.filter(t =>  isCardDone(t));

  const renderCard = (triage: TriageCard) => {
    const log = logs.find(l => l.voicemail_id === triage.voicemail_id);
    return (
      <SignalCard
        key={triage.voicemail_id}
        triage={triage}
        transcript={log?.transcript}
        phone_number={log?.phone_number}
        checked={checkedTasks[triage.voicemail_id] ?? {}}
        onToggle={(i) => handleToggle(triage.voicemail_id, i)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-12">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-heidi-green text-white p-2 rounded-lg">
                <Voicemail className="w-6 h-6" />
              </div>
              <div className="leading-tight">
                <h1 className="m-0 text-xl font-bold text-gray-900 font-display tracking-tight leading-tight">Heidi After-Hours Triage</h1>
                <h2 className="m-0 mt-0.5 text-xs text-gray-500 leading-tight">Automated Voicemail Intelligence</h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRegenerateData}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heidi-green"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Repopulate
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-heidi-green hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heidi-green transition-all ${isAnalyzing ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Run Intelligence
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <DashboardHeader summary={summary} />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('raw')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center gap-2 ${
                  activeTab === 'raw'
                    ? 'border-heidi-green text-heidi-green'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Database className="w-4 h-4" />
                Raw Data Ingestion ({logs.length})
              </button>
              <button
                onClick={() => setActiveTab('signals')}
                disabled={triageResults.length === 0}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center gap-2 ${
                  activeTab === 'signals'
                    ? 'border-heidi-green text-heidi-green'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } ${triageResults.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Generated Signals {triageResults.length > 0 && `(${triageResults.length})`}
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 bg-gray-50 min-h-[500px]">
            {activeTab === 'raw' ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <RawDataTable data={logs} />
              </div>
            ) : (
              <div className="space-y-8">
                {summary && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800">
                      <strong>Analysis Complete:</strong> Triaged {summary.totalProcessed} voicemails in {(summary.processingTimeMs / 1000).toFixed(2)}s.
                      A human team would have taken approx {summary.humanTimeEquivalentMinutes} minutes.
                    </p>
                  </div>
                )}

                {/* Active cards */}
                {activeCards.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeCards.map(renderCard)}
                  </div>
                )}

                {/* Done section */}
                {doneCards.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Done ({doneCards.length})
                      </h3>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
                      {doneCards.map(renderCard)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
