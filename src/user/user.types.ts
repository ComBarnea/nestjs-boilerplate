import { AuthProviderEnums } from '../auth/auth.enums';
import { IPartialGroupAuth } from '../auth/auth.types';

export interface AuthToken {
    accessToken: string;
    provider: AuthProviderEnums;
}

export interface IUser extends IPartialGroupAuth{
    readonly email: string;
    readonly facebook: string;
    readonly tokens: AuthToken[];

    readonly firstName: string;
    readonly lastName: string;
    readonly gender: string;
    readonly profilePicture: string;
    readonly resetToken?: string;
    readonly resetTokenValidUntil?: Date;

    comparePassword(candidatePassword: string): boolean;
}

export interface ICreateUser {
    email: string;
    password?: string;
    facebook?: string;
    tokens?: AuthToken[];
    firstName?: string;
    lastName?: string;
    gender?: string;
    profilePicture?: string;
}

export interface IUpdateUser {
    email?: string;
    facebook?: string;
    tokens?: AuthToken[];
    firstName?: string;
    lastName?: string;
    gender?: string;
    password?: string;
    profilePicture?: string;
    resetToken?: string;
    resetTokenValidUntil?: Date;
}

export interface IFindUserById {
    _id: string;
}
export interface IFindUserByResetToken {
    resetToken: string;
}
export interface IFindUserByEmail {
    email: string;
}
export interface IFindUserByProvider {
    providerType: AuthProviderEnums;
    providerId: string;
}