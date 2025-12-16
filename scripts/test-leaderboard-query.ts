/**
 * Script test query leaderboard từ database
 * Dùng để debug vấn đề leaderboard không tải đúng record
 */

import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is not set");
  process.exit(1);
}

console.log("🔍 Testing leaderboard query...");
console.log(`📡 Connection: ${connectionString.substring(0, 50)}...`);

const sql = neon(connectionString);

async function testLeaderboardQuery() {
  try {
    // Test 1: Count total records
    console.log("\n📊 Test 1: Count total records");
    const countResult = await sql`
      SELECT COUNT(*) as count
      FROM benchmark_runs
    `;
    console.log("Total records:", countResult);

    // Test 2: Count records with valid data
    console.log("\n📊 Test 2: Count records with valid data");
    const validCountResult = await sql`
      SELECT COUNT(*) as count
      FROM benchmark_runs
      WHERE score IS NOT NULL
        OR download_mbps IS NOT NULL
        OR avg_ping_ms IS NOT NULL
    `;
    console.log("Valid records:", validCountResult);

    // Test 3: Get latest 10 records
    console.log("\n📊 Test 3: Get latest 10 records");
    const latestRows = await sql`
      SELECT
        id,
        created_at,
        server_label,
        avg_ping_ms,
        download_mbps,
        score
      FROM benchmark_runs
      WHERE score IS NOT NULL
        OR download_mbps IS NOT NULL
        OR avg_ping_ms IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 10
    `;
    console.log("Latest records:", latestRows);
    console.log(
      `Found ${Array.isArray(latestRows) ? latestRows.length : 0} records`
    );

    // Test 4: Check if lookup tables exist
    console.log("\n📊 Test 4: Check lookup tables");
    try {
      const providersCount = await sql`
        SELECT COUNT(*) as count FROM providers
      `;
      console.log("Providers table:", providersCount);
    } catch (error) {
      console.log(
        "⚠️  Providers table not found (expected if migration not applied)"
      );
    }

    // Test 5: Check recent records with all fields
    console.log("\n📊 Test 5: Check recent records with all fields");
    const detailedRows = await sql`
      SELECT
        id,
        created_at,
        server_label,
        avg_ping_ms,
        download_mbps,
        score,
        os_id,
        provider_id,
        virtualization_id,
        region_id
      FROM benchmark_runs
      ORDER BY created_at DESC
      LIMIT 5
    `;
    console.log("Detailed records:", JSON.stringify(detailedRows, null, 2));

    console.log("\n✅ All tests completed!");
  } catch (error) {
    console.error("\n❌ Error:", error);
    if (error instanceof Error) {
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
    }
    process.exit(1);
  }
}

testLeaderboardQuery();
