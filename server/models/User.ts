import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  googleId?: string;
  email: string;
  displayName: string;
  username?: string;
  avatarUrl: string;
  country: string;
  state: string;
  city: string;
  matchesPlayed: number;
  wins: number;
  imposterWins: number;
  winRate: number;
  isGuest: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    googleId: { type: String, unique: true, sparse: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    displayName: { type: String, required: true, trim: true },
    avatarUrl: { type: String, default: "" },
    country: { type: String, default: "India", trim: true, index: true },
    state: { type: String, default: "Maharashtra", trim: true, index: true },
    city: { type: String, default: "Mumbai", trim: true, index: true },
    matchesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    imposterWins: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    isGuest: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Method to recalculate win rate
UserSchema.methods["recalcStats"] = function (this: IUser, won: boolean, wasImposter: boolean) {
  this.matchesPlayed += 1;
  if (won) {
    this.wins += 1;
    if (wasImposter) {
      this.imposterWins += 1;
    }
  }
  this.winRate = Math.round((this.wins / this.matchesPlayed) * 100);
  return this.save();
};

export const User = mongoose.models["User"] || mongoose.model<IUser>("User", UserSchema);
