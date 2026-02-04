import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const adminTokens = new Map(); // token -> { createdAt }

function createAdminToken() {
  const token = crypto.randomBytes(32).toString('hex');
  adminTokens.set(token, { createdAt: Date.now() });
  return token;
}

function isAdminTokenValid(token) {
  if (!token) return false;
  const data = adminTokens.get(token);
  if (!data) return false;
  if (Date.now() - data.createdAt > TOKEN_TTL_MS) {
    adminTokens.delete(token);
    return false;
  }
  return true;
}

function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!isAdminTokenValid(token)) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  next();
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'mpitendry.db');

let db;

async function initDb() {
  const SQL = await initSqlJs();
  if (existsSync(dbPath)) {
    const buf = readFileSync(dbPath);
    db = new SQL.Database(buf);
  } else {
    db = new SQL.Database();
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS mpitendry_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lastName TEXT NOT NULL,
      firstNames TEXT NOT NULL,
      dateOfBirth TEXT NOT NULL,
      cinNumber TEXT NOT NULL,
      cinDateOfIssue TEXT NOT NULL,
      cinPlaceOfIssue TEXT NOT NULL,
      duplicataDate TEXT,
      duplicataPlace TEXT,
      instruments TEXT NOT NULL,
      yearsOfExperience TEXT NOT NULL,
      teaches INTEGER NOT NULL DEFAULT 0,
      diplomas TEXT,
      collaborations TEXT,
      createdAt TEXT NOT NULL
    )
  `);
  // Migration : ajout téléphone et ville si les colonnes n'existent pas
  try {
    const info = db.exec('PRAGMA table_info(mpitendry_members)');
    const columns = (info[0] && info[0].values) ? info[0].values.map((r) => r[1]) : [];
    if (!columns.includes('phone')) db.run('ALTER TABLE mpitendry_members ADD COLUMN phone TEXT');
    if (!columns.includes('city')) db.run('ALTER TABLE mpitendry_members ADD COLUMN city TEXT');
  } catch (_) {}
  saveDb();
}

// ——— Données de démo (si base vide) ———
const DEMO_MEMBERS = [
  {
    lastName: 'RAKOTOMALALA',
    firstNames: 'Miora',
    dateOfBirth: '1990-04-15',
    cinNumber: '102 198 305 112',
    cinDateOfIssue: '2011-05-20',
    cinPlaceOfIssue: 'Fianarantsoa',
    duplicataDate: null,
    duplicataPlace: null,
    instruments: 'Valiha, chant, lokanga',
    yearsOfExperience: "12 ans d'expérience",
    teaches: 1,
    diplomas: 'DEM Musiques traditionnelles, Conservatoire régional',
    collaborations: 'Tarika Malagasy, Festival Donia, enregistrements radio',
    phone: '+261 33 12 345 67',
    city: 'Fianarantsoa',
  },
  {
    lastName: 'ANDRIANALISON',
    firstNames: 'Tahina',
    dateOfBirth: '1987-11-08',
    cinNumber: '103 287 416 223',
    cinDateOfIssue: '2009-03-14',
    cinPlaceOfIssue: 'Toamasina',
    duplicataDate: '2016-07-22',
    duplicataPlace: 'Toamasina',
    instruments: 'Guitare, basse, kabosy, chant',
    yearsOfExperience: "18 ans d'expérience",
    teaches: 0,
    diplomas: 'Autodidacte, stages avec artistes internationaux',
    collaborations: 'Groupe Tsy mbola nisy, tournées régionales, studio',
    phone: '+261 32 98 765 43',
    city: 'Toamasina',
  },
  {
    lastName: 'Rakoto',
    firstNames: 'Jean François',
    dateOfBirth: '1985-03-12',
    cinNumber: '101 234 567 089',
    cinDateOfIssue: '2005-06-01',
    cinPlaceOfIssue: 'Antananarivo',
    duplicataDate: null,
    duplicataPlace: null,
    instruments: 'Valiha, kabosy',
    yearsOfExperience: '18',
    teaches: 1,
    diplomas: 'Conservatoire national, Valiha',
    collaborations: 'Tarika, Ny Antsaly',
    phone: '+261 33 11 222 33',
    city: 'Antananarivo',
  },
  {
    lastName: 'Randriamampionona',
    firstNames: 'Marie Claudine',
    dateOfBirth: '1992-07-22',
    cinNumber: '102 345 678 090',
    cinDateOfIssue: '2012-09-15',
    cinPlaceOfIssue: 'Fianarantsoa',
    duplicataDate: null,
    duplicataPlace: null,
    instruments: 'Piano, chant',
    yearsOfExperience: '10',
    teaches: 1,
    diplomas: 'DEM Piano',
    collaborations: 'Orchestre régional, chorale',
    phone: '+261 34 55 666 77',
    city: 'Fianarantsoa',
  },
  {
    lastName: 'Rasolondraibe',
    firstNames: 'Andry',
    dateOfBirth: '1988-11-05',
    cinNumber: '103 456 789 091',
    cinDateOfIssue: '2008-04-20',
    cinPlaceOfIssue: 'Toamasina',
    duplicataDate: null,
    duplicataPlace: null,
    instruments: 'Guitare, basse, sodina',
    yearsOfExperience: '14',
    teaches: 0,
    diplomas: '',
    collaborations: 'Tsy mbola nisy',
    phone: '+261 32 44 555 66',
    city: 'Toamasina',
  },
  {
    lastName: 'Razafindrakoto',
    firstNames: 'Lalao',
    dateOfBirth: '1995-01-30',
    cinNumber: '104 567 890 092',
    cinDateOfIssue: '2015-02-10',
    cinPlaceOfIssue: 'Antananarivo',
    duplicataDate: null,
    duplicataPlace: null,
    instruments: 'Valiha, lokanga, chant',
    yearsOfExperience: '7',
    teaches: 1,
    diplomas: 'Formation traditionnelle valiha',
    collaborations: 'Groupe Hazo, festival Mozika',
    phone: '+261 33 77 888 99',
    city: 'Antananarivo',
  },
  {
    lastName: 'Andriamanantena',
    firstNames: 'Hery',
    dateOfBirth: '1980-09-18',
    cinNumber: '105 678 901 093',
    cinDateOfIssue: '2000-12-05',
    cinPlaceOfIssue: 'Antsirabe',
    duplicataDate: '2018-03-01',
    duplicataPlace: 'Antsirabe',
    instruments: 'Marovany, accordéon',
    yearsOfExperience: '22',
    teaches: 1,
    diplomas: 'Maître marovany',
    collaborations: 'Nombreux festivals, enregistrements',
    phone: '+261 34 00 111 22',
    city: 'Antsirabe',
  },
  {
    lastName: 'Rajaonarison',
    firstNames: 'Solo',
    dateOfBirth: '1998-04-25',
    cinNumber: '106 789 012 094',
    cinDateOfIssue: '2018-08-12',
    cinPlaceOfIssue: 'Mahajanga',
    duplicataDate: null,
    duplicataPlace: null,
    instruments: 'Batterie, percussion malagasy',
    yearsOfExperience: '5',
    teaches: 0,
    diplomas: '',
    collaborations: 'Groupes locaux',
    phone: '+261 32 33 444 55',
    city: 'Mahajanga',
  },
];

function seedDemoData() {
  const count = db.exec('SELECT COUNT(*) as n FROM mpitendry_members');
  const n = count[0]?.values[0]?.[0] ?? 0;
  if (n > 0) return;
  const now = new Date().toISOString();
  for (const m of DEMO_MEMBERS) {
    db.run(
      `INSERT INTO mpitendry_members (
        lastName, firstNames, dateOfBirth,
        cinNumber, cinDateOfIssue, cinPlaceOfIssue, duplicataDate, duplicataPlace,
        instruments, yearsOfExperience, teaches, diplomas, collaborations, phone, city, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        m.lastName,
        m.firstNames,
        m.dateOfBirth,
        m.cinNumber,
        m.cinDateOfIssue,
        m.cinPlaceOfIssue,
        m.duplicataDate,
        m.duplicataPlace,
        m.instruments,
        m.yearsOfExperience,
        m.teaches ? 1 : 0,
        m.diplomas ?? '',
        m.collaborations ?? '',
        m.phone ?? '',
        m.city ?? '',
        now,
      ]
    );
  }
  saveDb();
  console.log(`${DEMO_MEMBERS.length} membres de démo insérés.`);
}

function saveDb() {
  try {
    const data = db.export();
    writeFileSync(dbPath, Buffer.from(data));
  } catch (e) {
    console.warn('Could not save DB:', e.message);
  }
}

await initDb();
seedDemoData();

const app = express();
app.use(cors());
app.use(express.json());

const PUBLIC_FIELDS = ['id', 'lastName', 'firstNames', 'instruments', 'yearsOfExperience', 'teaches', 'phone', 'city', 'createdAt'];

// Réponses d'erreur cohérentes
function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

// Santé API (pour monitoring / cohérence)
app.get('/api/health', (req, res) => {
  try {
    const count = db.exec('SELECT COUNT(*) as n FROM mpitendry_members');
    const n = count[0]?.values[0]?.[0] ?? 0;
    res.json({ ok: true, members: n });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/stats', (req, res) => {
  try {
    const total = db.exec('SELECT COUNT(*) as n FROM mpitendry_members');
    const teaches = db.exec('SELECT COUNT(*) as n FROM mpitendry_members WHERE teaches = 1');
    res.json({
      totalMembers: total[0]?.values[0]?.[0] ?? 0,
      teachesCount: teaches[0]?.values[0]?.[0] ?? 0,
    });
  } catch (err) {
    sendError(res, 500, err.message);
  }
});

app.get('/api/members', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM mpitendry_members ORDER BY id DESC');
    const list = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      const member = {};
      PUBLIC_FIELDS.forEach((f) => { member[f] = row[f]; });
      member.teaches = Boolean(row.teaches);
      list.push(member);
    }
    stmt.free();
    res.json(list);
  } catch (err) {
    sendError(res, 500, err.message);
  }
});

// Fiche publique d'un membre (espace membre)
app.get('/api/members/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return sendError(res, 400, 'ID invalide');
    const stmt = db.prepare('SELECT * FROM mpitendry_members WHERE id = ?');
    stmt.bind([id]);
    if (!stmt.step()) {
      stmt.free();
      return sendError(res, 404, 'Membre introuvable');
    }
    const row = stmt.getAsObject();
    stmt.free();
    const member = {};
    PUBLIC_FIELDS.forEach((f) => { member[f] = row[f]; });
    member.teaches = Boolean(row.teaches);
    res.json(member);
  } catch (err) {
    sendError(res, 500, err.message);
  }
});

// Validation des champs requis pour l'inscription
const MEMBER_REQUIRED = ['lastName', 'firstNames', 'dateOfBirth', 'cinNumber', 'cinDateOfIssue', 'cinPlaceOfIssue', 'instruments', 'yearsOfExperience'];
const MAX_LEN = {
    lastName: 100,
    firstNames: 200,
    dateOfBirth: 10,
    cinNumber: 30,
    cinDateOfIssue: 10,
    cinPlaceOfIssue: 100,
    duplicataDate: 10,
    duplicataPlace: 100,
    instruments: 300,
    yearsOfExperience: 80,
    diplomas: 500,
    collaborations: 1000,
    phone: 30,
    city: 100,
  };

function validateMember(body) {
  if (!body || typeof body !== 'object') return 'Données invalides';
  for (const field of MEMBER_REQUIRED) {
    const v = body[field];
    if (v === undefined || v === null) return `Champ requis manquant : ${field}`;
    const s = String(v).trim();
    if (field !== 'teaches' && s === '') return `Champ requis vide : ${field}`;
  }
  const trim = (s) => (s == null ? '' : String(s).trim());
  for (const [key, max] of Object.entries(MAX_LEN)) {
    const val = trim(body[key]);
    if (val.length > max) return `Champ "${key}" trop long (max ${max} caractères)`;
  }
  return null;
}

app.post('/api/members', (req, res) => {
  try {
    const body = req.body;
    const err = validateMember(body);
    if (err) return sendError(res, 400, err);
    const trim = (s) => (s == null ? '' : String(s).trim());
    db.run(
      `INSERT INTO mpitendry_members (
        lastName, firstNames, dateOfBirth,
        cinNumber, cinDateOfIssue, cinPlaceOfIssue, duplicataDate, duplicataPlace,
        instruments, yearsOfExperience, teaches, diplomas, collaborations, phone, city, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        trim(body.lastName),
        trim(body.firstNames),
        trim(body.dateOfBirth),
        trim(body.cinNumber),
        trim(body.cinDateOfIssue),
        trim(body.cinPlaceOfIssue),
        body.duplicataDate ? trim(body.duplicataDate) : null,
        body.duplicataPlace ? trim(body.duplicataPlace) : null,
        trim(body.instruments),
        trim(body.yearsOfExperience),
        body.teaches ? 1 : 0,
        trim(body.diplomas) || '',
        trim(body.collaborations) || '',
        trim(body.phone) || '',
        trim(body.city) || '',
        new Date().toISOString(),
      ]
    );
    const row = db.exec('SELECT last_insert_rowid() as id');
    const id = row[0]?.values[0]?.[0] ?? null;
    saveDb();
    res.status(201).json({ id });
  } catch (err) {
    sendError(res, 500, err.message);
  }
});

// ——— Admin (protégé par mot de passe) ———
app.post('/api/admin/login', (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return sendError(res, 400, 'Données invalides');
  }
  const password = body.password != null ? String(body.password) : '';
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  }
  const token = createAdminToken();
  res.json({ token });
});

app.get('/api/admin/members', adminAuth, (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM mpitendry_members ORDER BY id DESC');
    const list = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      list.push({
        ...row,
        teaches: Boolean(row.teaches),
      });
    }
    stmt.free();
    res.json(list);
  } catch (err) {
    sendError(res, 500, err.message);
  }
});

app.delete('/api/admin/members/:id', adminAuth, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return sendError(res, 400, 'ID invalide');
    }
    const checkStmt = db.prepare('SELECT 1 FROM mpitendry_members WHERE id = ?');
    checkStmt.bind([id]);
    const exists = checkStmt.step();
    checkStmt.free();
    if (!exists) return sendError(res, 404, 'Membre introuvable');
    db.run('DELETE FROM mpitendry_members WHERE id = ?', [id]);
    saveDb();
    res.status(204).send();
  } catch (err) {
    sendError(res, 500, err.message);
  }
});

// Réinitialiser et recharger les données de démo (admin uniquement)
app.post('/api/admin/seed-demo', adminAuth, (req, res) => {
  try {
    db.run('DELETE FROM mpitendry_members');
    db.run("DELETE FROM sqlite_sequence WHERE name = 'mpitendry_members'");
    seedDemoData();
    res.json({ message: `${DEMO_MEMBERS.length} membres de démo rechargés.` });
  } catch (err) {
    sendError(res, 500, err.message);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur API SQLite sur http://localhost:${PORT}`);
});
