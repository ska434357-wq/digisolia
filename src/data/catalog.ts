import type { TrainingProgram } from '../types';

export const TRAINING_PROGRAMS: TrainingProgram[] = [
  {
    id: 'ai-exec-strategy',
    audience: 'executives',
    durationDays: 2,
    durationLabel: {
      fr: '2 jours (14h)',
      en: '2 days (14h)',
    },
    formatLabel: {
      fr: 'Présentiel Ouagadougou · Distanciel',
      en: 'Ouagadougou In-Person · Remote Live',
    },
    levelLabel: {
      fr: 'Dirigeants & Décideurs',
      en: 'Executives & Leaders',
    },
    priceFcfa: '350 000 FCFA',
    priceLabel: {
      fr: '350 000 FCFA / participant',
      en: '350,000 FCFA / participant',
    },
    nextSession: {
      fr: 'Prochaine cohorte : 4 – 5 Décembre 2026',
      en: 'Next cohort: December 4 – 5, 2026',
    },
    title: {
      fr: 'IA Stratégique pour Dirigeants de PME',
      en: 'Strategic AI for SME Executives',
    },
    summary: {
      fr: 'Identifier les cas d’usage à retour sur investissement rapide, piloter la sécurité des données et déployer l’IA dans vos équipes sans surcoût technique.',
      en: 'Identify high-ROI use cases, govern company data safely, and deploy practical AI workflows across your teams without heavy IT overhead.',
    },
    outcomes: {
      fr: [
        'Cartographie des 5 processus rentables à automatiser dans votre entreprise',
        'Charte interne d’utilisation sécurisée des données financières et clients',
        'Plan d’adoption sur 90 jours chiffré avec indicateurs de suivi',
      ],
      en: [
        'Roadmap of the top 5 profitable workflows to automate in your company',
        'Internal governance policy for financial and customer data privacy',
        '90-day adoption plan with clear budget and KPI benchmarks',
      ],
    },
    modules: {
      fr: [
        'Panorama réaliste des modèles et coûts pour les PME africaines',
        'Audit express de maturité numérique et sélection des cas d’usage',
        'Atelier pratique : synthèse financière, appels d’offres et reporting',
        'Gouvernance, confidentialité et conduite du changement',
      ],
      en: [
        'Practical landscape of AI models and realistic budgets for West African SMEs',
        'Rapid digital readiness audit and use-case prioritization',
        'Hands-on workshop: financial synthesis, tender drafting, and reporting',
        'Data privacy, governance, and team change management',
      ],
    },
  },
  {
    id: 'ai-ops-productivity',
    audience: 'teams',
    durationDays: 3,
    durationLabel: {
      fr: '3 jours (21h)',
      en: '3 days (21h)',
    },
    formatLabel: {
      fr: 'Intra-entreprise · Inter-entreprises',
      en: 'In-Company · Open Cohort',
    },
    levelLabel: {
      fr: 'Équipes Commerciales, RH & Admin',
      en: 'Sales, HR & Operations Teams',
    },
    priceFcfa: '240 000 FCFA',
    priceLabel: {
      fr: '240 000 FCFA / participant',
      en: '240,000 FCFA / participant',
    },
    nextSession: {
      fr: 'Prochaine cohorte : 10 – 12 Décembre 2026',
      en: 'Next cohort: December 10 – 12, 2026',
    },
    title: {
      fr: 'Productivité Opérationnelle & Bureautique IA',
      en: 'Operational Productivity & AI Office Workflows',
    },
    summary: {
      fr: 'Accélérez la rédaction de propositions commerciales, le traitement des dossiers, l’analyse Excel et le support client multicanal au quotidien.',
      en: 'Speed up proposal writing, document processing, spreadsheet analysis, and multichannel customer support in daily operations.',
    },
    outcomes: {
      fr: [
        'Bibliothèque de 25 prompts métier prêts pour vos devis, emails et comptes rendus',
        'Automatisation du tri de documents PDF et tableaux Excel/Google Sheets',
        'Modèles de réponses structurées pour le suivi client WhatsApp',
      ],
      en: [
        'Library of 25 ready-to-use business prompts for quotes, emails, and minutes',
        'Automated PDF extraction and Excel/Google Sheets analysis workflows',
        'Structured response templates for WhatsApp customer follow-ups',
      ],
    },
    modules: {
      fr: [
        'Maîtriser le prompt engineering appliqué aux métiers de gestion',
        'Analyse automatisée de tableaux financiers et suivi des stocks',
        'Rédaction commerciale, comptes rendus et notes de service en 5 minutes',
        'Cas pratique fil rouge adapté aux documents réels de votre équipe',
      ],
      en: [
        'Applied prompt engineering for operations and management roles',
        'Automated spreadsheet analysis and inventory tracking',
        'Drafting proposals, meeting minutes, and memos in 5 minutes',
        'Capstone workshop using your team’s real operational documents',
      ],
    },
  },
  {
    id: 'ai-automation-whatsapp',
    audience: 'teams',
    durationDays: 3,
    durationLabel: {
      fr: '3 jours (21h)',
      en: '3 days (21h)',
    },
    formatLabel: {
      fr: 'Atelier Pratique · Distanciel ou Présentiel',
      en: 'Hands-On Lab · Remote or In-Person',
    },
    levelLabel: {
      fr: 'Marketing, Service Client & Ops',
      en: 'Marketing, Support & Ops',
    },
    priceFcfa: '290 000 FCFA',
    priceLabel: {
      fr: '290 000 FCFA / participant',
      en: '290,000 FCFA / participant',
    },
    nextSession: {
      fr: 'Prochaine cohorte : 17 – 19 Décembre 2026',
      en: 'Next cohort: December 17 – 19, 2026',
    },
    title: {
      fr: 'Automatisation Sans Code & Assistants WhatsApp',
      en: 'No-Code Automation & WhatsApp Assistants',
    },
    summary: {
      fr: 'Reliez vos formulaires, factures, CRM et WhatsApp Business grâce aux connecteurs automatisés et aux assistants IA fiables.',
      en: 'Connect your lead forms, invoicing, CRM, and WhatsApp Business with reliable no-code workflows and AI assistants.',
    },
    outcomes: {
      fr: [
        'Un flux complet fonctionnel reliant formulaire Web, tableur CRM et alerte WhatsApp',
        'Qualification automatique des demandes entrantes 24h/24',
        'Réduction de 60% des saisies manuelles répétitives',
      ],
      en: [
        'Working workflow linking web forms, CRM sheets, and instant WhatsApp alerts',
        'Automated 24/7 inbound lead qualification',
        'Up to 60% reduction in repetitive manual data entry',
      ],
    },
    modules: {
      fr: [
        'Architecture des flux automatisés : déclencheurs, filtres et webhooks',
        'Connecter Google Workspace, bases clients et messagerie WhatsApp',
        'Intégrer un agent IA de pré-qualification avec garde-fous stricts',
        'Tests de fiabilité, gestion d’erreurs et mise en production',
      ],
      en: [
        'Workflow architecture: triggers, routing filters, and webhooks',
        'Connecting Google Workspace, client databases, and WhatsApp messaging',
        'Deploying a pre-qualification AI agent with strict guardrails',
        'Reliability testing, error recovery, and production launch',
      ],
    },
  },
  {
    id: 'ai-engineering-rag',
    audience: 'tech',
    durationDays: 5,
    durationLabel: {
      fr: '5 jours (35h)',
      en: '5 days (35h)',
    },
    formatLabel: {
      fr: 'Bootcamp Technique · Sur devis entreprise',
      en: 'Technical Bootcamp · Custom Corporate',
    },
    levelLabel: {
      fr: 'Développeurs & Équipes IT',
      en: 'Developers & IT Teams',
    },
    priceFcfa: '480 000 FCFA',
    priceLabel: {
      fr: '480 000 FCFA / participant',
      en: '480,000 FCFA / participant',
    },
    nextSession: {
      fr: 'Prochaine cohorte : 12 – 16 Janvier 2027',
      en: 'Next cohort: January 12 – 16, 2027',
    },
    title: {
      fr: 'Développement d’Applications IA & Systèmes RAG',
      en: 'Building Production AI Apps & RAG Systems',
    },
    summary: {
      fr: 'Conception d’assistants documentaires fiables connectés à vos bases internes, appels structurés d’API LLM et maîtrise des coûts d’inférence.',
      en: 'Build reliable document-grounded assistants connected to internal knowledge bases, structured LLM APIs, and cost-controlled inference.',
    },
    outcomes: {
      fr: [
        'Déploiement complet d’un assistant RAG interrogeant vos procédures internes',
        'Sorties JSON typées, évaluation automatique et prévention des hallucinations',
        'Optimisation des coûts API et mise en cache pour connexions limitées',
      ],
      en: [
        'End-to-end RAG assistant querying internal procedures and contracts',
        'Structured JSON outputs, automated evals, and hallucination prevention',
        'API cost optimization and caching for bandwidth-constrained environments',
      ],
    },
    modules: {
      fr: [
        'Fondamentaux API LLM, contextes longs et sorties structurées',
        'Indexation documentaire, embeddings et recherche hybride (RAG)',
        'Agents outillés (Function Calling) reliés aux bases SQL et ERP',
        'Sécurité, journalisation, quotas et déploiement en production',
      ],
      en: [
        'LLM APIs, long-context design, and strict structured outputs',
        'Document chunking, embeddings, and hybrid retrieval (RAG)',
        'Tool-using agents (Function Calling) linked to SQL and ERP systems',
        'Security, logging, rate limiting, and production deployment',
      ],
    },
  },
];
