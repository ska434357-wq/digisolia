import Database from 'better-sqlite3';
import crypto from 'crypto';
import dotenv from 'dotenv';
import express, { type NextFunction, type Request, type Response } from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_CODE = process.env.ADMIN_ACCESS_CODE || 'DIGISOLIA-2026';
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || crypto.createHash('sha256').update(ADMIN_CODE + ':digisolia').digest('hex');

const dbPath = path.resolve(process.cwd(), 'digisolia.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK(type IN ('quote', 'training')),
    full_name TEXT NOT NULL,
    company TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    service TEXT NOT NULL,
    budget TEXT NOT NULL DEFAULT '',
    timeline TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    training_id TEXT,
    training_title TEXT,
    participants_count INTEGER,
    preferred_format TEXT,
    language TEXT NOT NULL DEFAULT 'fr',
    status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'qualified', 'archived')),
    created_at TEXT NOT NULL
  );
`);

function signAdminToken(): string {
  const payload = Buffer.from(JSON.stringify({ role: 'admin', iat: Date.now() })).toString('base64url');
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifyAdminToken(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
  if (sig.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token || !verifyAdminToken(token)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[^\d]/g, '');
  return digits.length >= 8 && digits.length <= 16;
}

function generateLeadId(prefix: 'Q' | 'T'): string {
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  return `DS-${prefix}-${datePart}-${rand}`;
}

function mapLeadRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    type: row.type,
    fullName: row.full_name,
    company: row.company,
    phone: row.phone,
    email: row.email,
    service: row.service,
    budget: row.budget,
    timeline: row.timeline,
    message: row.message,
    trainingId: row.training_id || undefined,
    trainingTitle: row.training_title || undefined,
    participantsCount: row.participants_count ?? undefined,
    preferredFormat: row.preferred_format || undefined,
    language: row.language,
    status: row.status,
    createdAt: row.created_at,
  };
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'digisolia-api' });
  });

  app.post('/api/leads', (req, res) => {
    const body = req.body ?? {};
    const fullName = String(body.fullName || '').trim().slice(0, 120);
    const company = String(body.company || '').trim().slice(0, 120);
    const phone = String(body.phone || '').trim().slice(0, 40);
    const email = String(body.email || '').trim().slice(0, 160);
    const service = String(body.service || 'web').trim();
    const budget = String(body.budget || '').trim().slice(0, 80);
    const timeline = String(body.timeline || '').trim().slice(0, 80);
    const message = String(body.message || '').trim().slice(0, 2000);
    const language = body.language === 'en' ? 'en' : 'fr';

    if (!fullName || !isValidPhone(phone) || !isValidEmail(email) || !message) {
      res.status(400).json({ error: 'Invalid or incomplete quote request fields.' });
      return;
    }

    const allowedServices = new Set(['web', 'mobile', 'automation', 'ai_training']);
    const safeService = allowedServices.has(service) ? service : 'web';
    const id = generateLeadId('Q');
    const createdAt = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO leads (
        id, type, full_name, company, phone, email, service, budget, timeline, message, language, status, created_at
      ) VALUES (?, 'quote', ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)
    `);

    stmt.run(id, fullName, company, phone, email, safeService, budget, timeline, message, language, createdAt);
    res.status(201).json({ id, status: 'new', createdAt });
  });

  app.post('/api/enrollments', (req, res) => {
    const body = req.body ?? {};
    const fullName = String(body.fullName || '').trim().slice(0, 120);
    const company = String(body.company || '').trim().slice(0, 120);
    const phone = String(body.phone || '').trim().slice(0, 40);
    const email = String(body.email || '').trim().slice(0, 160);
    const trainingId = String(body.trainingId || '').trim().slice(0, 80);
    const trainingTitle = String(body.trainingTitle || '').trim().slice(0, 180);
    const preferredFormat = String(body.preferredFormat || '').trim().slice(0, 100);
    const participantsCount = Math.max(1, Math.min(200, Number(body.participantsCount) || 1));
    const message = String(body.message || '').trim().slice(0, 1500);
    const language = body.language === 'en' ? 'en' : 'fr';

    if (!fullName || !isValidPhone(phone) || !isValidEmail(email) || !trainingId || !trainingTitle) {
      res.status(400).json({ error: 'Invalid or incomplete training enrollment fields.' });
      return;
    }

    const id = generateLeadId('T');
    const createdAt = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO leads (
        id, type, full_name, company, phone, email, service, message,
        training_id, training_title, participants_count, preferred_format, language, status, created_at
      ) VALUES (?, 'training', ?, ?, ?, ?, 'ai_training', ?, ?, ?, ?, ?, ?, 'new', ?)
    `);

    stmt.run(
      id,
      fullName,
      company,
      phone,
      email,
      message,
      trainingId,
      trainingTitle,
      participantsCount,
      preferredFormat,
      language,
      createdAt
    );

    res.status(201).json({ id, status: 'new', createdAt });
  });

  app.post('/api/admin/auth', (req, res) => {
    const code = String(req.body?.accessCode || '').trim();
    if (!code || code !== ADMIN_CODE) {
      res.status(401).json({ error: 'Invalid access code' });
      return;
    }
    res.json({ authorized: true, token: signAdminToken() });
  });

  app.get('/api/admin/leads', requireAdmin, (_req, res) => {
    const rows = db.prepare('SELECT * FROM leads ORDER BY datetime(created_at) DESC').all() as Record<string, unknown>[];
    res.json({ leads: rows.map(mapLeadRow) });
  });

  app.patch('/api/admin/leads/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const status = String(req.body?.status || '');
    const allowed = new Set(['new', 'contacted', 'qualified', 'archived']);
    if (!allowed.has(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }
    const info = db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, id);
    if (info.changes === 0) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }
    res.json({ ok: true, id, status });
  });

  app.delete('/api/admin/leads/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const info = db.prepare('DELETE FROM leads WHERE id = ?').run(id);
    if (info.changes === 0) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }
    res.json({ ok: true, id });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        ws: { server: httpServer },
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`DigiSolia server listening on http://localhost:${PORT}`);
  });
}

void startServer();
