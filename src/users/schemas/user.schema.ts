import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    facebook: String,
    tokens: Array,
    name: String,
    gender: String,
    profilePicture: String
}, { timestamps: true });
