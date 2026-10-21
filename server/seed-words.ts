import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db";
import { WordPair } from "./models/WordPair";
import { INITIAL_WORD_PAIRS } from "./game/words";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  console.log("[Seed] Connecting to MongoDB Atlas...");
  await connectDB();

  const wordsJsonPath = path.join(__dirname, "data", "words.json");
  if (!fs.existsSync(wordsJsonPath)) {
    console.error(`[Seed] Error: words.json not found at ${wordsJsonPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(wordsJsonPath, "utf-8");
  const wordsFromCsv: Array<{
    commonWord: string;
    imposterWord: string;
    category: string;
    language: string;
    difficulty: "easy" | "medium" | "hard";
  }> = JSON.parse(raw);

  console.log(`[Seed] Loaded ${wordsFromCsv.length} word pairs from CSV dataset.`);

  // Combine with initial curated categories (Transport, Nature, Sports, Everyday Objects, Professions, Music)
  const combined: Array<{
    commonWord: string;
    imposterWord: string;
    category: string;
    language: string;
    difficulty: "easy" | "medium" | "hard";
    active: boolean;
  }> = [];

  const seen = new Set<string>();

  // Add dataset pairs first
  for (const item of wordsFromCsv) {
    const common = item.commonWord.trim();
    const imposter = item.imposterWord.trim();
    const key = `${common.toLowerCase()}:::${imposter.toLowerCase()}:::${item.category.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      combined.push({
        commonWord: common,
        imposterWord: imposter,
        category: item.category.trim(),
        language: item.language.trim().toLowerCase(),
        difficulty: item.difficulty || "easy",
        active: true,
      });
    }
  }

  // Add initial pairs if not already present
  for (const item of INITIAL_WORD_PAIRS) {
    const common = item.common.trim();
    const imposter = item.imposter.trim();
    const key = `${common.toLowerCase()}:::${imposter.toLowerCase()}:::${item.category.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      combined.push({
        commonWord: common,
        imposterWord: imposter,
        category: item.category.trim(),
        language: "en",
        difficulty: "easy",
        active: true,
      });
    }
  }

  console.log(`[Seed] Total unique word pairs prepared: ${combined.length}`);

  // Clean and insert into database
  console.log("[Seed] Clearing existing WordPair collection to ensure clean import...");
  await (WordPair as any).deleteMany({});

  // Insert in batches of 1000 to prevent BSON/network limits
  const BATCH_SIZE = 1000;
  let inserted = 0;
  for (let i = 0; i < combined.length; i += BATCH_SIZE) {
    const batch = combined.slice(i, i + BATCH_SIZE);
    await (WordPair as any).insertMany(batch, { ordered: false });
    inserted += batch.length;
    console.log(`[Seed] Inserted ${inserted} / ${combined.length} word pairs...`);
  }

  const finalCount = await (WordPair as any).countDocuments();
  console.log(`=======================================================`);
  console.log(`[Seed Complete] Successfully stored ${finalCount} word pairs in MongoDB Atlas!`);
  console.log(`=======================================================`);

  // Verify categories
  const categories = await (WordPair as any).aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  console.log("Categories breakdown in database:");
  for (const cat of categories) {
    console.log(` - ${cat._id}: ${cat.count} pairs`);
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error("[Seed] Fatal error during seeding:", err);
  process.exit(1);
});
