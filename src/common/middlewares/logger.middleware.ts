import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import chalk from 'chalk';
import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';

/**
 * Request logging middleware.
 * @export
 * @class LoggerMiddleware
 * @implements {NestMiddleware}
 */
@Middleware()
export class LoggerMiddleware implements NestMiddleware {
    private template = '[%%] %% [%%]';

    private getMessage(...args: string[]) {
        return this.template
            .split('%%')
            .reduce((aggregate, chunk, i) => aggregate + chunk + (args[i] || ''), '');
    }

    resolve(logger: Logger): ExpressMiddleware {
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