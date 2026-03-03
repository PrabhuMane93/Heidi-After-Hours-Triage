import React from 'react';
import { Voicemail, Zap, Clock } from 'lucide-react';
import { AnalysisSummary } from '../types';

interface Props {
  summary: AnalysisSummary | null;
}

export const DashboardHeader: React.FC<Props> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-500 text-sm font-medium">Total Voicemails</span>
          <Voicemail className="w-5 h-5 text-heidi-green" />
        </div>
        <div className="text-3xl font-bold font-display text-gray-900">
          {summary ? summary.totalProcessed : '-'}
        </div>
        <div className="text-xs text-gray-400 mt-1">Data ingestion layer</div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-heidi-accent to-transparent opacity-50 rounded-bl-full"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-500 text-sm font-medium">Processed in</span>
          <Clock className="w-5 h-5 text-blue-500" />
        </div>
        <div className="text-3xl font-bold font-display text-gray-900">
          {summary ? `${(summary.processingTimeMs / 1000).toFixed(2)}s` : '-'}
        </div>
        <div className="text-xs text-gray-400 mt-1">AI execution time</div>
      </div>

      <div className="bg-gradient-to-br from-heidi-green to-blue-900 p-6 rounded-xl shadow-lg text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-blue-100 text-sm font-medium">Reduced Review Time by</span>
          <Zap className="w-5 h-5 text-yellow-300" />
        </div>
        <div className="text-3xl font-bold font-display">
          {summary ? `${summary.speedMultiplier.toFixed(0)}x` : '-'}
        </div>
        <div className="text-xs text-blue-200 mt-1">Faster than manual analysis</div>
      </div>
    </div>
  );
};
