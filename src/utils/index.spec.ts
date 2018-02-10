import * as requestLib from 'request';
import * as nestCommon from '@nestjs/common';
import { wrappedRequest } from './index';

describe('Utils', () => {
    const orgGet = requestLib.get;

    beforeEach(async () => {

    });

    afterEach(async () => {
        Object.defineProperty(requestLib, 'get', {value: orgGet});
    });

    describe('wrappedRequest', () => {
        it('should fail with general', async () => {
            const mock = jest
                .fn((data, cb) => cb('general error'));

            Object.defineProperty(requestLib, 'get', {value: mock});

            try {
                const answer = await wrappedRequest({});
            } catch (err) {
                expect(err).toBe('general error');
            }
        });

        it('should fail with http exception', async () => {
            const mock = jest
                .fn((data, cb) => cb(null, {statusCode: 400}, {error: {message: 'not general error'}}));

            Object.defineProperty(requestLib, 'get', {value: mock});

            try {
                const answer = await wrappedRequest({});
            } catch (err) {
                expect(err.message).toBe('not general error');
            }

        });

        it('should return data', async () => {
            const mock = jest
                .fn((data, cb) => cb(null, {statusCode: 200, headers: {data: 'not error'}}, {info: {data: 'not error'}}));

            Object.defineProperty(requestLib, 'get', {value: mock});

            const answer = await wrappedRequest({});

            expect(answer.data.info.data).toBe('not error');
            expect(answer.response.headers.data).toBe('not error');
        });
    });
});