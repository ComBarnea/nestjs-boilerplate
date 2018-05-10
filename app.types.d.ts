declare namespace NodeJS {
    export interface Process {
        env: ProcessEnv;
        verbose: boolean;
    }

    export interface ProcessEnv {
        SECRET: string;
        DB_URL: string;
        DOCKER_ENV: 'true';
        NODE_ENV: 'dev';
        FACEBOOK_GRAPH_API_VERSION: string;
        FACEBOOK_ID: string;
        FACEBOOK_SECRET: string;
        GOOGLE_ID: string;
        GOOGLE_SECRET: string;
        VERBOSE: string;
    }
}