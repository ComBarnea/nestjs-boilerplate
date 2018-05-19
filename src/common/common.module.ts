import {
    Module,
    NestModule,
    MiddlewareConsumer,
    RequestMethod,
    Logger
} from '@nestjs/common';
import { LoggerMiddleware } from './middlewares';
import { loggerMiddlewareRoutes } from './middlewares/logger.middleware';
import * as httpContext from 'express-http-context';

const contextFactory = {
    provide: 'Context',
    useFactory: () => {
        return httpContext;
    }
};

/**
 * Common module which contains useful utilities.
 * @export
 * @class CommonModule
 * @implements {NestModule}
 */
@Module({
    providers: [contextFactory],
    exports: [contextFactory]
})
export class CommonModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(LoggerMiddleware)
            .with(new Logger('Request', true))
            .forRoutes(loggerMiddlewareRoutes);
    }
}