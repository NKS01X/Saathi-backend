// @ts-check
import mongoose from "mongoose";

/**
 * Allowed mistake categories
 * @typedef {"Syntax"|"Logic"|"Security"|"Performance"|"Readability"} MistakeCategory
 */

/**
 * Shape of data BEFORE saving to DB
 * @typedef {Object} MistakeInput
 * @property {number} userId
 * @property {MistakeCategory} mistakeCategory
 * @property {string} conceptTag
 */

/**
 * Shape of data AFTER saving to DB
 * @typedef {MistakeInput & {
 *   _id: mongoose.Types.ObjectId,
 *   createdAt: Date
 * }} MistakeDocument
 */

const mistakeSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      index: true
    },

    mistakeCategory: {
      type: String,
      required: true,
      enum: ["Syntax", "Logic", "Security", "Performance", "Readability"]
    },

    conceptTag: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const Mistake = mongoose.model("Mistake", mistakeSchema);
