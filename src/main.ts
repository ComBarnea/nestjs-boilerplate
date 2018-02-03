import * as env from 'dotenv';
env.config({ path: '.env.example' });

import * as express from 'express';
import * as bodyParser from 'body-parser';

import { NestFactory } from '@nestjs/core';
import { PORT, ROUTE_PREFIX } from './app.constants';
import { ApplicationModule } from './app.module';
import { initDocumentation } from './documentation';

export async function bootstrap() {
    const server = express();
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }));

    const app = await NestFactory.create(ApplicationModule, server);

    /**
     * Prefix our api with a version prefix,
     * will help with breaking changes for future releases
     */
    app.setGlobalPrefix(ROUTE_PREFIX);

    initDocumentation(app, {
        version: '0.0.1',
        description: 'Nest boilerplate description.',
        title: 'Nest boilerplate',
        endpoint: '/docs'
    });

    await app.listen(PORT);
}
