import React, { useState } from 'react';
import { TriageCard, UrgencyLevel } from '../types';

interface Props {
  triage: TriageCard;
  transcript?: string;
  phone_number?: string;
  checked: Record<number, boolean>;
  onToggle: (index: number) => void;
}

const urgencyStyles: Record<UrgencyLevel, { badge: string; accent: string }> = {
  EMERGENCY: { badge: 'bg-red-100 text-red-800 border-red-200',         accent: 'border-l-4 border-l-red-500' },
  TODAY:     { badge: 'bg-orange-100 text-orange-800 border-orange-200', accent: 'border-l-4 border-l-orange-500' },
  SOON:      { badge: 'bg-amber-100 text-amber-800 border-amber-200',    accent: 'border-l-4 border-l-amber-400' },
  ROUTINE:   { badge: 'bg-green-100 text-green-800 border-green-200',    accent: 'border-l-4 border-l-green-500' },
  ADMIN:     { badge: 'bg-blue-100 text-blue-800 border-blue-200',       accent: 'border-l-4 border-l-blue-400' },
};

export const SignalCard: React.FC<Props> = ({ triage, transcript, phone_number, checked, onToggle }) => {
  const [showTranscript, setShowTranscript] = useState(false);
  const styles = urgencyStyles[triage.urgency] ?? urgencyStyles.ROUTINE;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-all duration-200 ${styles.accent}`}>

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border mb-2 ${styles.badge}`}>
            {triage.urgency}
          </span>
          <h3 className="font-bold text-gray-900 text-base leading-snug">{triage.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{phone_number ?? triage.voicemail_id}</p>
        </div>
        <div className="flex flex-col items-end ml-4 shrink-0">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Confidence</span>
          <span className="text-sm font-bold text-gray-900">{Math.round(triage.confidence_score * 100)}%</span>
        </div>
      </div>

      {/* Summary with transcript tooltip */}
      <div
        className="relative mb-4"
        onMouseEnter={() => setShowTranscript(true)}
        onMouseLeave={() => setShowTranscript(false)}
      >
        <p className={`text-sm text-gray-600 leading-relaxed ${transcript ? 'cursor-help' : ''}`}>
          {triage.summary}
        </p>
        {transcript && showTranscript && (
          <div className="absolute bottom-full left-0 mb-2 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 z-20 shadow-xl leading-relaxed">
            <p className="font-semibold text-gray-300 uppercase tracking-wide mb-1.5">Original Transcript</p>
            <p className="italic text-gray-100">{transcript}</p>
          </div>
        )}
      </div>

      {/* Tasks */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Tasks</p>
        <ul className="space-y-2.5">
          {triage.tasks.map((task, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={!!checked[i]}
                onChange={() => onToggle(i)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 cursor-pointer accent-blue-600"
              />
              <span className={`text-sm ${checked[i] ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {task}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
