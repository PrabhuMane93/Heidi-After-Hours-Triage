import React from 'react';
import { VoicemailLog } from '../types';

interface Props {
  data: VoicemailLog[];
}

const timeBucketStyles: Record<string, string> = {
  'Evening':    'bg-amber-100 text-amber-800',
  'Late Night': 'bg-indigo-100 text-indigo-800',
  'Morning':    'bg-orange-100 text-orange-800',
};

const formatDatetime = (dt: Date): string =>
  dt.toLocaleString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

export const RawDataTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voicemail ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transcript</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date and Time</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours Since Received</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Bucket</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.voicemail_id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.voicemail_id}</td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                <span className="block truncate" title={row.transcript}>{row.transcript}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDatetime(row.datetime)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.phone_number}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.hours_since_received}h</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${timeBucketStyles[row.time_bucket]}`}>
                  {row.time_bucket}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
