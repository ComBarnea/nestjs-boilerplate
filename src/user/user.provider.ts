import { Document } from 'mongoose';
import { IUser } from './user.types';

export type UserModel = Document & IUser;
