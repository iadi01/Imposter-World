import mongoose, { Document, Schema } from "mongoose";

export interface IWordPair extends Document {
  language: string;
  category: string;
  commonWord: string;
  imposterWord: string;
  difficulty: "easy" | "medium" | "hard";
  active: boolean;
}

const WordPairSchema = new Schema<IWordPair>(
  {
    language: { type: String, default: "en", index: true },
    category: { type: String, required: true, index: true },
    commonWord: { type: String, required: true },
    imposterWord: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy", index: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Compound index for random queries with category & difficulty
WordPairSchema.index({ active: 1, category: 1, difficulty: 1, language: 1 });

export const WordPair = mongoose.models["WordPair"] || mongoose.model<IWordPair>("WordPair", WordPairSchema);
