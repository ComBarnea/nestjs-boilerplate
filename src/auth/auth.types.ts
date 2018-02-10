import { AuthProviderEnums } from './auth.enums';
import { ICreateUser } from '../user/user.interface';

export interface IAuthProviderLogin {
    providerType: AuthProviderEnums;
    user: ICreateUser;
    providerId: string;
    providerToken: string;
}