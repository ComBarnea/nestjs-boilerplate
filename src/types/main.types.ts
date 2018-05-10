import { Request } from 'express';
import { UserModel } from '../user/user.provider';
export interface IServerRequest extends Request {
    user: UserModel;
}