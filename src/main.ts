import * as env from 'dotenv';
env.config({ path: '.env.example' });

import * as express from 'express';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';

async function bootstrap() {
    const server = express();
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }));

    const app = await NestFactory.create(ApplicationModule, server);
    await app.listen(8080);
}

bootstrap();
