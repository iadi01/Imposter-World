import mongoose, { Document, Schema } from "mongoose";

export interface IMatchPlayer {
  userId?: string;
  displayName: string;
  avatarUrl?: string;
  role: "detective" | "imposter";
  score: number;
  won: boolean;
}

export interface IMatch extends Document {
  roomCode: string;
  mode: string;
  rounds: number;
  players: IMatchPlayer[];
  imposterNames: string[];
  commonWord: string;
  imposterWord: string;
  winnerTeam: "detectives" | "imposters" | "tie";
  resultBanner: string;
  completedAt: Date;
}

const MatchPlayerSchema = new Schema<IMatchPlayer>({
  userId: { type: String, ref: "User" },
  displayName: { type: String, required: true },
  avatarUrl: { type: String },
  role: { type: String, enum: ["detective", "imposter"], required: true },
  score: { type: Number, default: 0 },
  won: { type: Boolean, default: false },
});

const MatchSchema = new Schema<IMatch>(
  {
    roomCode: { type: String, required: true, index: true },
    mode: { type: String, default: "normal" },
    rounds: { type: Number, default: 3 },
    players: [MatchPlayerSchema],
    imposterNames: [{ type: String }],
    commonWord: { type: String, required: true },
    imposterWord: { type: String, required: true },
    winnerTeam: { type: String, enum: ["detectives", "imposters", "tie"], required: true },
    resultBanner: { type: String, required: true },
    completedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export const Match = mongoose.models["Match"] || mongoose.model<IMatch>("Match", MatchSchema);
