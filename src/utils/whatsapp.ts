import type { Language, ServiceId } from '../types';

export const DIGISOLIA_CONTACT = {
  whatsappNumber: '22670478322',
  phonePrimary: '+226 70 47 83 22',
  phoneSecondary: '+226 76 12 78 09',
  email: 'contact@digisolia.com',
  city: 'Ouagadougou, Burkina Faso',
  region: 'Afrique de l’Ouest',
};

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${DIGISOLIA_CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoUrl(subject: string, body: string): string {
  return `mailto:${DIGISOLIA_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function formatQuoteWhatsAppMessage(params: {
  language: Language;
  fullName: string;
  company: string;
  phone: string;
  email: string;
  service: ServiceId;
  budget: string;
  timeline: string;
  message: string;
}): string {
  const serviceLabels: Record<ServiceId, Record<Language, string>> = {
    web: { fr: 'Application Web sur mesure', en: 'Custom Web Application' },
    mobile: { fr: 'Application Mobile', en: 'Mobile Application' },
    automation: { fr: 'Automatisation & Workflows', en: 'Process Automation' },
    ai_training: { fr: 'Formation en Intelligence Artificielle', en: 'AI Training Program' },
  };

  if (params.language === 'en') {
    return [
      'Hello DigiSolia, I just submitted a quote request on your website:',
      `• Name: ${params.fullName}`,
      `• Company: ${params.company || 'Not specified'}`,
      `• Service: ${serviceLabels[params.service].en}`,
      `• Estimated Budget: ${params.budget}`,
      `• Target Timeline: ${params.timeline}`,
      `• Email: ${params.email}`,
      `• Phone: ${params.phone}`,
      `• Project Details: ${params.message}`,
    ].join('\n');
  }

  return [
    'Bonjour DigiSolia, je viens de soumettre une demande de devis depuis votre site :',
    `• Nom : ${params.fullName}`,
    `• Entreprise : ${params.company || 'Non précisée'}`,
    `• Service souhaité : ${serviceLabels[params.service].fr}`,
    `• Budget estimatif : ${params.budget}`,
    `• Délai souhaité : ${params.timeline}`,
    `• Email : ${params.email}`,
    `• Téléphone : ${params.phone}`,
    `• Description du besoin : ${params.message}`,
  ].join('\n');
}

export function formatTrainingWhatsAppMessage(params: {
  language: Language;
  trainingTitle: string;
  fullName: string;
  company: string;
  participantsCount: number;
  preferredFormat: string;
  phone: string;
  email: string;
}): string {
  if (params.language === 'en') {
    return [
      'Hello DigiSolia, I would like to register for an AI training program:',
      `• Program: ${params.trainingTitle}`,
      `• Name: ${params.fullName}`,
      `• Organization: ${params.company || 'Individual'}`,
      `• Participants: ${params.participantsCount}`,
      `• Preferred Format: ${params.preferredFormat}`,
      `• Email: ${params.email}`,
      `• Phone: ${params.phone}`,
    ].join('\n');
  }

  return [
    'Bonjour DigiSolia, je souhaite réserver une session de formation IA :',
    `• Programme : ${params.trainingTitle}`,
    `• Nom : ${params.fullName}`,
    `• Entreprise : ${params.company || 'À titre individuel'}`,
    `• Nombre de participants : ${params.participantsCount}`,
    `• Format souhaité : ${params.preferredFormat}`,
    `• Email : ${params.email}`,
    `• Téléphone : ${params.phone}`,
  ].join('\n');
}
