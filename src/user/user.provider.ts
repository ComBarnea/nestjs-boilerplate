import { Document } from 'mongoose';
import { IUser } from './user.interface';

export type UserModel = Document & IUser;
