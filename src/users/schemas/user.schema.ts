import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    facebook: String,
    tokens: Array,
    firstName: String,
    lastName: String,
    gender: String,
    profilePicture: String
}, { timestamps: true });
