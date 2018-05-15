import { Injectable, Logger, NestMiddleware, RequestMethod } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import chalk from 'chalk';

/**
 * Request logging middleware.
 * @export
 * @class LoggerMiddleware
 * @implements {NestMiddleware}
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private template: string = '[%%] %% [%%]';

    private getMessage(...args: string[]) {
        return this.template
            .split('%%')
            .reduce((aggregate, chunk, i) => aggregate + chunk + (args[i] || ''), '');
    }

    resolve(logger: Logger) {
        return (req: Request, res: Response, next: NextFunction) => {
            const message = this.getMessage(
                chalk.white(req.method),
                req.ip,
                chalk.white('route: ', req.path)
            );

            logger.log(message);
            next();
        };
    }
}

export const loggerMiddlewareRoutes: any = {
    path: '/**',
    method: RequestMethod.ALL
};