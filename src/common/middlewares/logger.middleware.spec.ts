import { LoggerMiddleware } from './logger.middleware';

import chalk from 'chalk';

describe('Logger middleware', () => {
    const logger = {
        log: jest.fn()
    } as any;

    const loggerMiddleware = new LoggerMiddleware();

    it('should define `resolve` method', async () => {
        expect(loggerMiddleware.resolve).toBeDefined();
    });

    it('should log', async () => {
        const req = {
            method: 'POST',
            path: 'api/path',
            ip: '127.0.0.1'
        } as any;

        const res = {} as any;
        const next = jest.fn() as any;

        Object.defineProperty(chalk, 'white', {value: jest.fn()});

        loggerMiddleware.resolve(logger)(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(chalk.white).toHaveBeenCalledTimes(2);
        expect(logger.log).toHaveBeenCalledTimes(1);
    });
});