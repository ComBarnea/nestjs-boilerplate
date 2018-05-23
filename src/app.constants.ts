import { Config, IEnvironmentConfig } from './config';

let env = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'dev') env = 'development';

export const SERVER_CONFIG: IEnvironmentConfig = Config[env];

export const APP_TOKENS = {
    userModel: 'User',
    authGroupsModel: 'AuthGroups',
    partialAuthQuery: 'partialAuthQuery'
};

export const APP_REFLECTOR_TOKENS = {
    modelType: 'modelType',
    befPipe: 'befPipe',
    authRoles: 'authRoles',
    authPermission: 'authPermission'
};

export const addConfigToEnv = () => {
    process.PORT = SERVER_CONFIG.port;
    process.env.DB_URL = SERVER_CONFIG.db;
    process.env.SECRET = SERVER_CONFIG.jwtSecret;
    process.verbose = SERVER_CONFIG.verbose;
    process.verbose_api = SERVER_CONFIG.verboseApi;
    process.env.FACEBOOK_ID = SERVER_CONFIG.facebookId;
    process.env.FACEBOOK_SECRET = SERVER_CONFIG.facebookSecret;
    process.env.GOOGLE_ID = SERVER_CONFIG.googleId;
    process.env.GOOGLE_SECRET = SERVER_CONFIG.googleSecret;
};

export const PORT: any = process.env.PORT || 3000;
export const ROUTE_PREFIX = '/v1';