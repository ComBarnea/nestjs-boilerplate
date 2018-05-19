import { AuthProviderEnums } from './auth.enums';
import { ICreateUser } from '../user/user.types';
import { ISingleAuth } from '../authorization/schemas/authorization.partial.schema';

export interface IAuthProviderLogin {
    providerType: AuthProviderEnums;
    user: ICreateUser;
    providerId: string;
    providerToken: string;
}
export interface IResetPasswordRequest {
    email: string;
}

export interface IGetUserWithPasswordResetToken {
    token: string;
}

// TODO: should we add hew the same one again?
export interface IResetUserPassword {
    token: string;
    newPassword: string;
}

export interface IPartialGroupAuth {
    authS: ISingleAuth[];
}