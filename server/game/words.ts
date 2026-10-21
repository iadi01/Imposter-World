import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { WordPair } from "../models/WordPair";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface WordPairItem {
  category: string;
  common: string;
  imposter: string;
  language?: string;
  difficulty?: "easy" | "medium" | "hard";
}

export const INITIAL_WORD_PAIRS: WordPairItem[] = [
  { category: "Food & Drinks", common: "Pizza", imposter: "Burger", language: "en", difficulty: "easy" },
  { category: "Food & Drinks", common: "Coffee", imposter: "Tea", language: "en", difficulty: "easy" },
  { category: "Food & Drinks", common: "Apple", imposter: "Mango", language: "en", difficulty: "easy" },
  { category: "Food & Drinks", common: "Chocolate", imposter: "Ice Cream", language: "en", difficulty: "easy" },
  { category: "Food & Drinks", common: "Cake", imposter: "Pancake", language: "en", difficulty: "easy" },
  { category: "Food & Drinks", common: "Sushi", imposter: "Noodles", language: "en", difficulty: "easy" },
  { category: "Food & Drinks", common: "Milk", imposter: "Juice", language: "en", difficulty: "easy" },
  { category: "Food & Drinks", common: "Sandwich", imposter: "Taco", language: "en", difficulty: "easy" },
  { category: "Food & Drinks", common: "Popcorn", imposter: "Chips", language: "en", difficulty: "easy" },
  
  { category: "Transport", common: "Train", imposter: "Bus", language: "en", difficulty: "easy" },
  { category: "Transport", common: "Airplane", imposter: "Helicopter", language: "en", difficulty: "easy" },
  { category: "Transport", common: "Bicycle", imposter: "Motorcycle", language: "en", difficulty: "easy" },
  { category: "Transport", common: "Boat", imposter: "Submarine", language: "en", difficulty: "easy" },
  { category: "Transport", common: "Car", imposter: "Truck", language: "en", difficulty: "easy" },
  { category: "Transport", common: "Rocket", imposter: "Satellite", language: "en", difficulty: "easy" },

  { category: "Nature & Places", common: "Beach", imposter: "Desert", language: "en", difficulty: "easy" },
  { category: "Nature & Places", common: "Mountain", imposter: "Volcano", language: "en", difficulty: "easy" },
  { category: "Nature & Places", common: "Ocean", imposter: "River", language: "en", difficulty: "easy" },
  { category: "Nature & Places", common: "Forest", imposter: "Jungle", language: "en", difficulty: "easy" },
  { category: "Nature & Places", common: "Sun", imposter: "Moon", language: "en", difficulty: "easy" },
  { category: "Nature & Places", common: "Rain", imposter: "Snow", language: "en", difficulty: "easy" },
  { category: "Nature & Places", common: "Island", imposter: "Continent", language: "en", difficulty: "easy" },

  { category: "Sports & Games", common: "Cricket", imposter: "Baseball", language: "en", difficulty: "easy" },
  { category: "Sports & Games", common: "Football", imposter: "Basketball", language: "en", difficulty: "easy" },
  { category: "Sports & Games", common: "Tennis", imposter: "Badminton", language: "en", difficulty: "easy" },
  { category: "Sports & Games", common: "Chess", imposter: "Checkers", language: "en", difficulty: "easy" },
  { category: "Sports & Games", common: "Swimming", imposter: "Diving", language: "en", difficulty: "easy" },
  { category: "Sports & Games", common: "Skating", imposter: "Skiing", language: "en", difficulty: "easy" },

  { category: "Music & Art", common: "Guitar", imposter: "Violin", language: "en", difficulty: "easy" },
  { category: "Music & Art", common: "Piano", imposter: "Keyboard", language: "en", difficulty: "easy" },
  { category: "Music & Art", common: "Drum", imposter: "Tambourine", language: "en", difficulty: "easy" },
  { category: "Music & Art", common: "Painting", imposter: "Drawing", language: "en", difficulty: "easy" },

  { category: "Animals", common: "Cat", imposter: "Tiger", language: "en", difficulty: "easy" },
  { category: "Animals", common: "Dog", imposter: "Wolf", language: "en", difficulty: "easy" },
  { category: "Animals", common: "Horse", imposter: "Zebra", language: "en", difficulty: "easy" },
  { category: "Animals", common: "Lion", imposter: "Cheetah", language: "en", difficulty: "easy" },
  { category: "Animals", common: "Eagle", imposter: "Hawk", language: "en", difficulty: "easy" },
  { category: "Animals", common: "Dolphin", imposter: "Whale", language: "en", difficulty: "easy" },
  { category: "Animals", common: "Penguin", imposter: "Duck", language: "en", difficulty: "easy" },
  { category: "Animals", common: "Rabbit", imposter: "Hamster", language: "en", difficulty: "easy" },

  { category: "Everyday Objects", common: "Notebook", imposter: "Diary", language: "en", difficulty: "easy" },
  { category: "Everyday Objects", common: "Pen", imposter: "Pencil", language: "en", difficulty: "easy" },
  { category: "Everyday Objects", common: "Watch", imposter: "Clock", language: "en", difficulty: "easy" },
  { category: "Everyday Objects", common: "Phone", imposter: "Tablet", language: "en", difficulty: "easy" },
  { category: "Everyday Objects", common: "Glasses", imposter: "Sunglasses", language: "en", difficulty: "easy" },
  { category: "Everyday Objects", common: "Backpack", imposter: "Handbag", language: "en", difficulty: "easy" },
  { category: "Everyday Objects", common: "Chair", imposter: "Sofa", language: "en", difficulty: "easy" },

  { category: "Professions", common: "Doctor", imposter: "Nurse", language: "en", difficulty: "easy" },
  { category: "Professions", common: "Teacher", imposter: "Professor", language: "en", difficulty: "easy" },
  { category: "Professions", common: "Pilot", imposter: "Astronaut", language: "en", difficulty: "easy" },
  { category: "Professions", common: "Chef", imposter: "Baker", language: "en", difficulty: "easy" },
  { category: "Professions", common: "Detective", imposter: "Spy", language: "en", difficulty: "easy" },
  { category: "Professions", common: "Firefighter", imposter: "Police", language: "en", difficulty: "easy" },
];

// Load full dataset in-memory cache for ultra-fast fallback & instant lookups
let cachedMemoryPairs: WordPairItem[] | null = null;

export function getAllMemoryWordPairs(): WordPairItem[] {
  if (cachedMemoryPairs) return cachedMemoryPairs;

  const pairs: WordPairItem[] = [...INITIAL_WORD_PAIRS];
  const seen = new Set<string>();
  for (const p of pairs) {
    seen.add(`${p.common.toLowerCase()}:::${p.imposter.toLowerCase()}`);
  }

  try {
    const jsonPath = path.join(__dirname, "../data/words.json");
    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, "utf-8");
      const list: Array<{
        commonWord: string;
        imposterWord: string;
        category: string;
        language: string;
        difficulty: "easy" | "medium" | "hard";
      }> = JSON.parse(raw);

      for (const item of list) {
        const key = `${item.commonWord.toLowerCase()}:::${item.imposterWord.toLowerCase()}`;
        if (!seen.has(key)) {
          seen.add(key);
          pairs.push({
            common: item.commonWord,
            imposter: item.imposterWord,
            category: item.category,
            language: item.language,
            difficulty: item.difficulty,
          });
        }
      }
    }
  } catch (err) {
    console.warn("[WordEngine] Could not read words.json for memory cache:", err);
  }

  cachedMemoryPairs = pairs;
  return cachedMemoryPairs;
}

export async function seedWordPairsIfEmpty() {
  try {
    const count = await (WordPair as any).countDocuments();
    if (count < 1000) {
      console.log(`[Database] Seeding complete curated word bank (current count: ${count})...`);
      const allPairs = getAllMemoryWordPairs();
      const docs = allPairs.map((p) => ({
        language: p.language || "en",
        category: p.category,
        commonWord: p.common,
        imposterWord: p.imposter,
        difficulty: p.difficulty || "easy",
        active: true,
      }));

      // Insert in chunks of 1000
      for (let i = 0; i < docs.length; i += 1000) {
        const chunk = docs.slice(i, i + 1000);
        await (WordPair as any).insertMany(chunk, { ordered: false });
      }
      const newCount = await (WordPair as any).countDocuments();
      console.log(`[Database] Successfully seeded ${newCount} word pairs!`);
    } else {
      console.log(`[Database] Word bank ready: ${count} verified pairs in MongoDB Atlas.`);
    }
  } catch (err) {
    console.warn("[Database] Could not seed word pairs (using memory fallback):", err);
  }
}

export interface WordQueryOptions {
  category?: string | undefined;
  language?: string | undefined;
  difficulty?: string | undefined;
}

export async function getRandomWordPair(options?: WordQueryOptions): Promise<{ common: string; imposter: string; category: string }> {
  try {
    if (mongoose.connection.readyState === 1) {
      const match: any = { active: true };

      if (options?.category && options.category !== "all" && options.category !== "All Categories") {
        match.category = options.category;
      }
      if (options?.difficulty && options.difficulty !== "all" && options.difficulty !== "Any") {
        match.difficulty = options.difficulty.toLowerCase();
      }

      const sample = await (WordPair as any).aggregate([
        { $match: match },
        { $sample: { size: 1 } },
      ]);

      if (sample && sample.length > 0) {
        return {
          common: sample[0].commonWord,
          imposter: sample[0].imposterWord,
          category: sample[0].category,
        };
      }

      // If specific category had 0 results, fall back to any active pair in database
      const fallbackSample = await (WordPair as any).aggregate([
        { $match: { active: true } },
        { $sample: { size: 1 } },
      ]);
      if (fallbackSample && fallbackSample.length > 0) {
        return {
          common: fallbackSample[0].commonWord,
          imposter: fallbackSample[0].imposterWord,
          category: fallbackSample[0].category,
        };
      }
    }
  } catch (err) {
    console.warn("[WordEngine] Database random fetch error, falling back to memory:", err);
  }

  // Memory fallback
  const all = getAllMemoryWordPairs();
  if (options?.category && options.category !== "all" && options.category !== "All Categories") {
    const filtered = all.filter((p) => p.category.toLowerCase() === options.category?.toLowerCase());
    if (filtered.length > 0) {
      const pick = filtered[Math.floor(Math.random() * filtered.length)]!;
      return { common: pick.common, imposter: pick.imposter, category: pick.category };
    }
  }

  const pick = all[Math.floor(Math.random() * all.length)]!;
  return { common: pick.common, imposter: pick.imposter, category: pick.category };
}
