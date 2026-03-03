import { VoicemailLog, TimeBucket } from '../types';
import rawData from '../heidi_voicemails_afterhours_coherent_50.json';

const getTimeBucket = (dt: Date): TimeBucket => {
  const hour = dt.getHours();
  if (hour >= 18) return 'Evening';   // 18:00 – 23:59
  if (hour < 5)   return 'Late Night'; // 00:00 – 04:59
  return 'Morning';                    // 05:00 – 07:59
};

const generateAfterHoursTimestamp = (): Date => {
  const now = new Date();

  // Window: yesterday 18:00 → today 08:00
  const windowStart = new Date(now);
  windowStart.setDate(windowStart.getDate() - 1);
  windowStart.setHours(18, 0, 0, 0);

  const windowEnd = new Date(now);
  windowEnd.setHours(8, 0, 0, 0);

  const windowMs = windowEnd.getTime() - windowStart.getTime(); // 14 hours
  return new Date(windowStart.getTime() + Math.random() * windowMs);
};

export const generateVoicemailData = (): VoicemailLog[] => {
  const now = new Date();

  return rawData.map((vm) => {
    const dt = generateAfterHoursTimestamp();
    const hoursAgo = (now.getTime() - dt.getTime()) / 3_600_000;

    return {
      voicemail_id: vm.voicemail_id,
      transcript: vm.transcript,
      phone_number: vm.phone_number,
      datetime: dt,
      hours_since_received: parseFloat(hoursAgo.toFixed(1)),
      time_bucket: getTimeBucket(dt),
    };
  });
};
