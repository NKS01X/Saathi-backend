import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    stats: {
      totalReviews: { type: Number, default: 0 },
      categories: {
        logic: { type: Number, default: 0 },
        syntax: { type: Number, default: 0 },
        security: { type: Number, default: 0 },
        performance: { type: Number, default: 0 },
        readability: { type: Number, default: 0 },
      },
      topStruggleTag: { type: String, default: "None yet" },
    },
  },
  { timestamps: true }
);

/* 🔒 Safe model export (prevents freeze on reload) */
export const User =
  mongoose.models.User || mongoose.model("User", userSchema);
