import {AuthProviderEnums} from './auth.enums';
import {ICreateUser} from '../users/user.interface';

export interface IAuthProviderLogin {
    providerType: AuthProviderEnums;
    user: ICreateUser;
    providerId: string;
    providerToken: string;
}