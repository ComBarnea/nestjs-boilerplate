interface IEnvironmentConfig {
    rootPath: string;
    db: string;
    port: number;
    jwtSecret: string;
    origin: string;
    protocol: string;
    facebookGraphApiVersion: string;
    facebookId: string;
    facebookSecret: string;
    googleId: string;
    googleSecret: string;
    addAuthorization: boolean;
    verbose: boolean;
    verboseApi: boolean;
}

interface IConfig {
    [key: string]: IEnvironmentConfig;

    development: IEnvironmentConfig;
    production: IEnvironmentConfig;
}

const rootPath = process.cwd();

const Config: IConfig = {
    development: {
        rootPath,
        db: 'mongodb://localhost/nest-test',
        port: 3000,
        jwtSecret: 'ASD#3dad@#FA#RAffdfd3',
        origin: 'localhost',
        protocol: 'http',
        // providers
        facebookGraphApiVersion: '2.11',
        facebookId: '905671126127242',
        facebookSecret: '53138ad3f632fb05aeb6e81d11189483',
        googleId: '974530617642-vvsicv0o0o0bhrp5su1tf4drmiq1qv5k.apps.googleusercontent.com',
        googleSecret: '9rs3laJTZw5h2yCWktekg5V9',
        // additional options
        addAuthorization: true,
        verbose: true,
        verboseApi: true
    },
    production: {
        rootPath,
        db: process.env.MONGODB_CONNECTION || 'mongodb://localhost/nest-test',
        port: process.env.PORT ? Number(process.env.PORT) : 3000,
        jwtSecret: process.env.JWT_SECRET || 'ASD#3dad@#FA#RAffdfsdsd222d3',
        origin: process.env.ORIGIN || 'localhost',
        protocol: process.env.PROTOCOL || 'http',
        // providers
        facebookGraphApiVersion: '2.11',
        facebookId: '905671126127242',
        facebookSecret: '53138ad3f632fb05aeb6e81d11189483',
        googleId: '974530617642-vvsicv0o0o0bhrp5su1tf4drmiq1qv5k.apps.googleusercontent.com',
        googleSecret: '9rs3laJTZw5h2yCWktekg5V9',
        // additional options
        addAuthorization: true,
        verbose: false,
        verboseApi: false

    }
};

export {
    IEnvironmentConfig,
    IConfig,
    Config
};
