
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import * as documentationModule from './documentation';
import { bootstrap } from './main';

describe('Main file', () => {
    describe('bootstrap', () => {
        let app;
        afterEach(async () => {
            if (app) app.close();
        });

        it('should init serve with correct parsers', async () => {
            const jsonOrg = bodyParser.json;
            const urlOrg = bodyParser.urlencoded;

            // override getter
            Object.defineProperty(bodyParser, 'json', {value: jest.fn()});
            Object.defineProperty(bodyParser, 'urlencoded', {value: jest.fn()});

            const jsonSpy = bodyParser.json;
            const urlSpy = bodyParser.json;

            _mockNest();
            try {
                app = await bootstrap();
            } catch (e) {

            }

            expect(jsonSpy).toHaveBeenCalledTimes(1);
            expect(urlSpy).toHaveBeenCalledTimes(1);

            // restore getter
            Object.defineProperty(bodyParser, 'json', {value: jsonOrg});
            Object.defineProperty(bodyParser, 'urlencoded', {value: urlOrg});
        });

        it('should create new nest application', async () => {
            const spy = jest.spyOn(NestFactory, 'create');

            try {
                app = await bootstrap();
            } catch (e) {

            }

            expect(spy).toHaveBeenCalledTimes(1);

            spy.mockRestore();
        });

        it('should init nest application with Exit Interceptor', async () => {
            jest.mock('./interceptors/app.exit.interceptor');

            const useGlobalInterceptors = jest.fn();

            NestFactory.create = jest.fn().mockReturnValue(Promise.resolve({
                setGlobalPrefix: jest.fn(),
                useGlobalInterceptors
            }));

            try {
                app = await bootstrap();
            } catch (e) {

            }

            expect(useGlobalInterceptors).toHaveBeenCalledTimes(1);

            jest.restoreAllMocks();
        });

        it('should init nest application with documentation', async () => {
            const spy = jest.spyOn(documentationModule, 'initDocumentation');

            _mockNest();

            try {
                app = await bootstrap();
            } catch (e) {

            }

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy.mock.calls[0].length).toBe(2);

            jest.restoreAllMocks();

        });

        it('should start listening', async () => {
            const listen = jest.fn();

            NestFactory.create = jest.fn().mockReturnValue(Promise.resolve({
                setGlobalPrefix: jest.fn(),
                useGlobalInterceptors: jest.fn(),
                listen,
                close: jest.fn()
            }));

            Object.defineProperty(documentationModule, 'initDocumentation', {value: jest.fn()});

            try {
                app = await bootstrap();
            } catch (e) {
                console.log('e', e);
            }

            expect(listen).toHaveBeenCalledTimes(1);

            jest.restoreAllMocks();
        });
    });
});

function _mockNest() {
    NestFactory.create = jest.fn().mockReturnValue(Promise.resolve({
        setGlobalPrefix: jest.fn(),
        useGlobalInterceptors: jest.fn(),
        close: jest.fn()
    }));
}