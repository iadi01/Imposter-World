import mongoose, { Document, Schema } from "mongoose";

export interface ISupporter extends Document {
  name: string;
  amount: number;
  message?: string;
  paidAt: Date;
  showAmount: boolean;
  status: "pending" | "approved" | "rejected";
  isVerified: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SupporterSchema = new Schema<ISupporter>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    amount: { type: Number, default: 0, min: 0 },
    message: { type: String, default: "", trim: true, maxlength: 500 },
    paidAt: { type: Date, default: Date.now, index: true },
    showAmount: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    isVerified: { type: Boolean, default: false, index: true },
    notes: { type: String, default: "", trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

SupporterSchema.index({ status: 1, isVerified: 1, paidAt: -1 });
SupporterSchema.index({ createdAt: -1 });
SupporterSchema.index({ paidAt: -1 });

if (mongoose.models["Supporter"]) {
  delete mongoose.models["Supporter"];
}

export const Supporter = mongoose.model<ISupporter>("Supporter", SupporterSchema);
