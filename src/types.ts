export type Language = 'fr' | 'en';

export type ServiceId = 'web' | 'mobile' | 'automation' | 'ai_training';

export type TrainingAudience = 'all' | 'executives' | 'teams' | 'tech';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'archived';

export interface TrainingProgram {
  id: string;
  audience: Exclude<TrainingAudience, 'all'>;
  durationDays: number;
  durationLabel: Record<Language, string>;
  formatLabel: Record<Language, string>;
  levelLabel: Record<Language, string>;
  priceFcfa: string;
  priceLabel: Record<Language, string>;
  title: Record<Language, string>;
  summary: Record<Language, string>;
  outcomes: Record<Language, string[]>;
  modules: Record<Language, string[]>;
  nextSession: Record<Language, string>;
}

export interface LeadPayload {
  id?: string;
  type: 'quote' | 'training';
  fullName: string;
  company: string;
  phone: string;
  email: string;
  service: ServiceId;
  budget: string;
  timeline: string;
  message: string;
  trainingId?: string;
  trainingTitle?: string;
  participantsCount?: number;
  preferredFormat?: string;
  language: Language;
  createdAt?: string;
  status?: LeadStatus;
}

export interface LeadRecord extends LeadPayload {
  id: string;
  status: LeadStatus;
  createdAt: string;
}
