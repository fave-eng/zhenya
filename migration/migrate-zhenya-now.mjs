#!/usr/bin/env node

/**
 * Ready-to-run migration for Zhenya.
 *
 * Both keys below are public anon keys already used by the browser site.
 * The script only reads/writes rows allowed by the RLS policies for student_id=zhenya.
 * Run supabase/schema.sql in the NEW project's SQL Editor before this script.
 */

process.env.SOURCE_SUPABASE_URL = 'https://icsxxgyhlhrwhgwtiret.supabase.co';
process.env.SOURCE_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljc3h4Z3lobGhyd2hnd3RpcmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NTQzNjksImV4cCI6MjEwMDEzMDM2OX0.ZX4eZOzsM4IWmoqtaygbli9SVtpcY4xOF2WA03aOOlQ';
process.env.TARGET_SUPABASE_URL = 'https://zqzgarvmpqqqaobeicpc.supabase.co';
process.env.TARGET_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxemdhcnZtcHFxcWFvYmVpY3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2ODQwNTIsImV4cCI6MjA5NzI2MDA1Mn0.gARetYwVZfInx3QKS0RvB2I5cOwegPMY5q3nJPX4ZP8';
process.env.STUDENT_ID = 'zhenya';

await import('./migrate-progress.mjs');
