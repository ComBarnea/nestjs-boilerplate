import * as env from 'dotenv';
import * as logger from 'morgan';
env.config({ path: '.env.example' });

import * as express from 'express';
import * as bodyParser from 'body-parser';

import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { initDocumentation } from './documentation';

async function bootstrap() {
    const server = express();
    server.use(logger(process.env.NODE_ENV));
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }));

    const app = await NestFactory.create(ApplicationModule, server);
    initDocumentation(app, {
        version: '0.0.1',
        description: 'Nest boilerplate description.',
        title: 'Nest boilerplate',
        endpoint: '/docs'
    });

    await app.listen(3000);
}

bootstrap();
