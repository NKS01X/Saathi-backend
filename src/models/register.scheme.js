import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        minLength: [3, "Username must be at least 3 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please fill a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters"],
    },
    //for analytics
    stats: {
        totalReviews: { type: Number, default: 0 },
        categories: {
            logic: { type: Number, default: 0 },
            syntax: { type: Number, default: 0 },
            security: { type: Number, default: 0 },
            performance: { type: Number, default: 0 },
            readability: { type: Number, default: 0 }
        },
        topStruggleTag: { type: String, default: "None yet" } 
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);