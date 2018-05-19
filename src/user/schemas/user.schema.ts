import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { PartialAuthorization } from '../../authorization/schemas/authorization.partial.schema';

export const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    facebook: String,
    google: String,
    tokens: Array,
    firstName: String,
    lastName: String,
    gender: String,
    password: {
        type: String,
        select: process.verbose_api ? true : false
    },
    resetToken: {
        type: String,
        select: process.verbose_api ? true : false
    },
    resetTokenValidUntil: {
        type: Date,
        select: process.verbose_api ? true : false
    },
    profilePicture: String,
    ...PartialAuthorization
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
