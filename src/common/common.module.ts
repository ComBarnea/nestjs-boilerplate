import {
    Module,
    NestModule,
    MiddlewaresConsumer,
    RequestMethod,
    Logger
} from '@nestjs/common';
import { LoggerMiddleware } from './middlewares';

/**
 * Common module which contains useful utilities.
 * @export
 * @class CommonModule
 * @implements {NestModule}
 */
@Module({})
export class CommonModule implements NestModule {
    public configure(consumer: MiddlewaresConsumer): void {
        consumer
            .apply(LoggerMiddleware)
            .with(new Logger('Request', true))
            .forRoutes({ path: '/**', method: RequestMethod.ALL });
    }
}