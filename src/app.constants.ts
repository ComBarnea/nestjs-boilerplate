import { Config, IEnvironmentConfig } from './config';

let env = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'dev') env = 'development';

export const SERVER_CONFIG: IEnvironmentConfig = Config[env];

export const PORT: any = process.env.PORT || 3000;
export const ROUTE_PREFIX = '/v1';

process.verbose = process.env.VERBOSE === 'TRUE';