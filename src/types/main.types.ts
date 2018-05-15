import { Request } from 'express';
import { UserModel } from '../user/user.provider';
import { RequestMethod } from '@nestjs/common';
export interface IServerRequest extends Request {
    user: UserModel;
}

export interface IMiddleWareRoute {
    path: string;
    method: RequestMethod;
}