export enum Specialty {
  GP = 'General Practitioner',
  PHYSIO = 'Physiotherapist',
  SURGEON = 'Surgeon',
  PSYCH = 'Psychologist'
}

export interface ClinicianLog {
  user_id: string;
  specialty: Specialty;
  session_count: number;
  avg_note_length: number; // in words
  last_active_days: number;
  template_usage_rate: number; // 0.0 to 1.0
}

export type TimeBucket = 'Evening' | 'Late Night' | 'Morning';

export interface VoicemailLog {
  voicemail_id: string;
  transcript: string;
  phone_number: string;
  datetime: Date;
  hours_since_received: number;
  time_bucket: TimeBucket;
}

export enum SignalCategory {
  FRICTION = 'Friction',
  REACTIVATION = 'Reactivation',
  POWER_USER = 'Power User',
  STABLE = 'Stable'
}

export interface InterventionSignal {
  userId: string;
  category: SignalCategory;
  confidence: number;
  reasoning: string;
  emailDraft: string;
}

export type UrgencyLevel = 'EMERGENCY' | 'TODAY' | 'SOON' | 'ROUTINE' | 'ADMIN';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TriageRoute = 'nurse' | 'gp' | 'admin' | 'emergency_escalation';
export type PrimaryIntent =
  | 'emergency_symptoms'
  | 'medication_issue'
  | 'test_results_followup'
  | 'appointment_booking'
  | 'prescription_refill'
  | 'referral_paperwork'
  | 'billing_admin'
  | 'mental_health_support'
  | 'chronic_condition_review'
  | 'other';

export interface TriageResult {
  voicemail_id: string;
  voicemail_title: string;
  caller_intent_summary: string;
  identity: {
    caller_name: string;
    patient_name_if_different: string;
  };
  intent: {
    primary_intent: PrimaryIntent;
  };
  urgency: {
    level: UrgencyLevel;
    reasoning: string;
  };
  key_entities: {
    doctor_names_mentioned: string[];
    referral_doctor_mentioned: string;
    symptoms_or_admin_keywords: string[];
  };
  information_gaps: string[];
  call_to_action: {
    triage_route: TriageRoute;
    tasks: Array<{
      task_label: string;
      priority: TaskPriority;
    }>;
  };
  confidence_score: number;
}

export interface TriageCard {
  voicemail_id: string;
  urgency: UrgencyLevel;
  title: string;
  summary: string;
  tasks: string[];
  confidence_score: number;
}

export interface AnalysisSummary {
  totalProcessed: number;
  signalsFound: number;
  processingTimeMs: number;
  humanTimeEquivalentMinutes: number;
  speedMultiplier: number;
}