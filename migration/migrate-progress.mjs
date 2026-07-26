#!/usr/bin/env node

/**
 * Copies Zhenya's learning progress between two Supabase projects.
 *
 * Required environment variables:
 *   SOURCE_SUPABASE_URL
 *   SOURCE_SUPABASE_KEY
 *   TARGET_SUPABASE_URL
 *   TARGET_SUPABASE_KEY
 *
 * Optional:
 *   STUDENT_ID=zhenya
 *   BACKUP_FILE=./migration/backups/zhenya-progress-<timestamp>.json
 *
 * The source key may be the public anon/publishable key because the current
 * RLS policies allow Zhenya to read her own progress. The target key may also
 * be public after supabase/schema.sql has been executed in the target project.
 * A service-role key can be used locally, but must never be committed or put
 * in browser code.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const TABLES = [
  {
    name: 'homework_progress',
    conflict: 'student_id,lesson_id',
    key: (row) => `${row.student_id}\u0000${row.lesson_id}`,
  },
  {
    name: 'vocabulary_progress',
    conflict: 'student_id,word_key',
    key: (row) => `${row.student_id}\u0000${row.word_key}`,
  },
  {
    name: 'vocabulary_topic_progress',
    conflict: 'student_id,topic_id',
    key: (row) => `${row.student_id}\u0000${row.topic_id}`,
  },
  {
    name: 'grammar_progress',
    conflict: 'student_id,topic_id',
    key: (row) => `${row.student_id}\u0000${row.topic_id}`,
  },
];

function required(name) {
  const value = String(process.env[name] || '').trim();
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function normalizeUrl(value) {
  return value.replace(/\/+$/, '');
}

function redact(value) {
  if (!value) return '';
  return value.length <= 12 ? '[hidden]' : `${value.slice(0, 6)}…${value.slice(-4)}`;
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function stripGeneratedId(row) {
  const copy = { ...row };
  delete copy.id;
  return copy;
}

async function rest({ baseUrl, key, table, method = 'GET', query = '', body }) {
  const response = await fetch(`${baseUrl}/rest/v1/${table}${query}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: method === 'POST'
        ? 'resolution=merge-duplicates,return=minimal'
        : 'count=exact',
      Range: '0-9999',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${method} ${table} failed (${response.status}): ${text.slice(0, 1000)}`);
  }
  if (!text) return [];
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${method} ${table} returned invalid JSON`);
  }
}

async function readRows(project, table, studentId) {
  const query = `?select=*&student_id=eq.${encodeURIComponent(studentId)}&order=id.asc`;
  const rows = await rest({ ...project, table, query });
  if (!Array.isArray(rows)) throw new Error(`Unexpected response for ${table}`);
  return rows;
}

async function upsertRows(project, tableConfig, rows) {
  if (!rows.length) return;
  const query = `?on_conflict=${encodeURIComponent(tableConfig.conflict)}`;
  await rest({
    ...project,
    table: tableConfig.name,
    method: 'POST',
    query,
    body: rows.map(stripGeneratedId),
  });
}

async function main() {
  const source = {
    baseUrl: normalizeUrl(required('SOURCE_SUPABASE_URL')),
    key: required('SOURCE_SUPABASE_KEY'),
  };
  const target = {
    baseUrl: normalizeUrl(required('TARGET_SUPABASE_URL')),
    key: required('TARGET_SUPABASE_KEY'),
  };
  const studentId = String(process.env.STUDENT_ID || 'zhenya').trim();
  const exportOnly = process.argv.includes('--export-only');
  const backupFile = path.resolve(
    projectRoot,
    process.env.BACKUP_FILE || `migration/backups/${studentId}-progress-${timestamp()}.json`,
  );

  if (source.baseUrl === target.baseUrl) {
    throw new Error('Source and target Supabase URLs are the same. Migration stopped.');
  }

  console.log(`Student: ${studentId}`);
  console.log(`Source:  ${source.baseUrl} (${redact(source.key)})`);
  console.log(`Target:  ${target.baseUrl} (${redact(target.key)})`);

  const backup = {
    format: 'english-space-progress-v1',
    exportedAt: new Date().toISOString(),
    studentId,
    sourceUrl: source.baseUrl,
    tables: {},
  };

  for (const table of TABLES) {
    const rows = await readRows(source, table.name, studentId);
    backup.tables[table.name] = rows;
    console.log(`Exported ${table.name}: ${rows.length}`);
  }

  await fs.mkdir(path.dirname(backupFile), { recursive: true });
  await fs.writeFile(backupFile, `${JSON.stringify(backup, null, 2)}\n`, 'utf8');
  console.log(`Backup saved: ${backupFile}`);

  if (exportOnly) {
    console.log('Export-only mode: target was not changed.');
    return;
  }

  for (const table of TABLES) {
    const rows = backup.tables[table.name];
    await upsertRows(target, table, rows);
    console.log(`Imported ${table.name}: ${rows.length}`);
  }

  let verified = true;
  for (const table of TABLES) {
    const sourceRows = backup.tables[table.name];
    const targetRows = await readRows(target, table.name, studentId);
    const targetKeys = new Set(targetRows.map(table.key));
    const missing = sourceRows.filter((row) => !targetKeys.has(table.key(row)));
    if (missing.length) verified = false;
    console.log(
      `Verified ${table.name}: source=${sourceRows.length}, target=${targetRows.length}, missing=${missing.length}`,
    );
  }

  if (!verified) throw new Error('Migration finished, but verification found missing rows. Keep using the old project.');
  console.log('Migration completed and verified successfully.');
}

main().catch((error) => {
  console.error(`ERROR: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
