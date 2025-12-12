#!/usr/bin/env tsx

import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("[!] DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(connectionString);

async function verifyMigration() {
  try {
    console.log(
      "[i] Verifying migration on:",
      connectionString.replace(/:[^:@]+@/, ":****@")
    );
    console.log("");

    // Check all tables
    const allTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;

    console.log("[i] All tables in database:");
    const tables = Array.isArray(allTables) ? allTables : [];
    for (const row of tables as Array<{ table_name: string }>) {
      console.log(`    - ${row.table_name}`);
    }

    console.log("");

    // Check lookup tables specifically
    const lookupTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('providers', 'provider_aliases', 'oses', 'os_aliases', 'virtualizations', 'regions')
      ORDER BY table_name
    `;

    const lookupTablesArray = Array.isArray(lookupTables) ? lookupTables : [];
    if (lookupTablesArray.length > 0) {
      console.log("[✓] Lookup tables found:");
      for (const row of lookupTablesArray as Array<{ table_name: string }>) {
        console.log(`    - ${row.table_name}`);
      }
    } else {
      console.log(
        "[!] Lookup tables NOT found - migration may not have been applied"
      );
    }

    // Check benchmark_runs and region_id
    const benchmarkTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name = 'benchmark_runs'
    `;

    if (Array.isArray(benchmarkTables) && benchmarkTables.length > 0) {
      console.log("");
      console.log("[✓] benchmark_runs table exists");

      const regionColumn = await sql`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public' 
          AND table_name = 'benchmark_runs'
          AND column_name = 'region_id'
      `;

      if (Array.isArray(regionColumn) && regionColumn.length > 0) {
        console.log("[✓] region_id column exists in benchmark_runs");
      } else {
        console.log("[!] region_id column NOT found in benchmark_runs");
      }
    }
  } catch (error) {
    console.error("[!] Verification failed:", error);
    process.exit(1);
  }
}

verifyMigration();
