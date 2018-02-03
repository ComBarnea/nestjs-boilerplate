import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    facebook: String,
    tokens: Array,
    firstName: String,
    lastName: String,
    gender: String,
    password: {
        type: String,
        select: false
    },
    profilePicture: String
}, { timestamps: true });

UserSchema.methods.comparePassword = comparePassword;

/**
 * Helper method for validating user's password.
 * @param {string} candidatePassword
 */
function comparePassword(candidatePassword: string) {
    return bcrypt.compare(`${candidatePassword}`, this.password)
        .catch(() => {
            throw {err: 'Error validating password'};
        });
}