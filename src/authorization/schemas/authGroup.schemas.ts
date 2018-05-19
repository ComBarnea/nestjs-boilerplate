import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const AuthGroupSchema = new mongoose.Schema({
    members: [],
    name: String
}, { timestamps: true });

export interface ISingleGroupMember {
    parentId: string;
    parentType: string;
}