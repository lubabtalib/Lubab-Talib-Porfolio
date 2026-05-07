const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'portfolio.db');
const DATABASE_URL = process.env.DATABASE_URL;

let sqliteDb = null;
let pgSql = null;
let initialized = false;
let initPromise = null;

function usePostgres() {
  return Boolean(DATABASE_URL);
}

async function getDb() {
  if (initialized) return usePostgres() ? pgSql : sqliteDb;
  if (initPromise) return initPromise;

  initPromise = initializeDb();
  return initPromise;
}

async function initializeDb() {
  if (usePostgres()) {
    const { neon } = require('@neondatabase/serverless');
    pgSql = neon(DATABASE_URL);
    await createPostgresTables();
  } else {
    const SQL = await initSqlJs();

    if (fs.existsSync(DB_PATH)) {
      const buffer = fs.readFileSync(DB_PATH);
      sqliteDb = new SQL.Database(buffer);
    } else {
      sqliteDb = new SQL.Database();
    }

    createSqliteTables();
    saveDb();
  }

  initialized = true;
  return usePostgres() ? pgSql : sqliteDb;
}

async function createPostgresTables() {
  await postgresQuery(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await postgresQuery(`
    CREATE TABLE IF NOT EXISTS content (
      id SERIAL PRIMARY KEY,
      section TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await postgresQuery(`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      technologies TEXT NOT NULL,
      achievements TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await postgresQuery(`
    CREATE TABLE IF NOT EXISTS skills (
      id SERIAL PRIMARY KEY,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      level INTEGER DEFAULT 80,
      sort_order INTEGER DEFAULT 0
    )
  `);

  await postgresQuery(`
    CREATE TABLE IF NOT EXISTS experience (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      period TEXT NOT NULL,
      description TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    )
  `);

  await postgresQuery(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function createSqliteTables() {
  sqliteDb.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  sqliteDb.run(`
    CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  sqliteDb.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      technologies TEXT NOT NULL,
      achievements TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  sqliteDb.run(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      level INTEGER DEFAULT 80,
      sort_order INTEGER DEFAULT 0
    )
  `);

  sqliteDb.run(`
    CREATE TABLE IF NOT EXISTS experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      period TEXT NOT NULL,
      description TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    )
  `);

  sqliteDb.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function saveDb() {
  if (!sqliteDb) return;

  const data = sqliteDb.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

async function queryAll(sql, params = []) {
  await getDb();

  if (usePostgres()) {
    return postgresQuery(toPostgresSql(sql), params);
  }

  const stmt = sqliteDb.prepare(sql);
  if (params.length) stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

async function queryOne(sql, params = []) {
  const results = await queryAll(sql, params);
  return results.length > 0 ? results[0] : null;
}

async function runStmt(sql, params = []) {
  await getDb();

  if (usePostgres()) {
    const rows = await postgresQuery(toPostgresInsertSql(sql), params);
    return { lastId: rows[0]?.id };
  }

  sqliteDb.run(sql, params);
  saveDb();
  return { lastId: sqliteDb.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] };
}

async function queryCount(sql, params = []) {
  const result = await queryOne(sql, params);
  if (!result) return 0;

  const keys = Object.keys(result);
  return Number(result[keys[0]]) || 0;
}

function toPostgresSql(sql) {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

function toPostgresInsertSql(sql) {
  const converted = toPostgresSql(sql).replace(/;\s*$/, '');
  if (/^\s*insert\s+/i.test(converted) && !/\breturning\b/i.test(converted)) {
    return `${converted} RETURNING id`;
  }
  return converted;
}

async function postgresQuery(sql, params = [], retries = 2) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await pgSql.query(sql, params);
    } catch (err) {
      lastError = err;
      if (!isTransientPostgresError(err) || attempt === retries) {
        throw err;
      }
      await delay(450 * (attempt + 1));
    }
  }

  throw lastError;
}

function isTransientPostgresError(err) {
  const message = String(err?.message || '');
  return /fetch failed|network|timeout|socket|ECONNRESET|ETIMEDOUT|ENOTFOUND/i.test(message);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  getDb,
  saveDb,
  queryAll,
  queryOne,
  runStmt,
  queryCount,
  usePostgres
};
