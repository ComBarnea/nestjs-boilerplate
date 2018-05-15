jest.mock('cors');
jest.mock('jsonwebtoken');
import * as cors from 'cors';
import * as jwt from 'jsonwebtoken';

import { /*AddFacebookCORS,*/ IsAuthenticated } from './auth.middleware';

describe('Auth Middleware', () => {
    /*describe('AddFacebookCORS', () => {
        const addFacebookCORS = new AddFacebookCORS();

        it('should define `resolve` method', async () => {
            expect(addFacebookCORS.resolve).toBeDefined();
        });

        it('should call cors', async () => {
            try {
                await addFacebookCORS.resolve()({} as any, {} as any, {} as any);
            } catch (e) {
                expect(cors).toHaveBeenCalledTimes(1);
            }
        });
    });*/

    describe('IsAuthenticated', () => {
        let isAuthenticated: IsAuthenticated;
        let authService;
        beforeEach(async () => {
            authService = {
                validateUser: jest.fn()
            } as any;

            isAuthenticated = new IsAuthenticated(authService);

        });

        it('should define `resolve` method', async () => {
            expect(isAuthenticated.resolve).toBeDefined();
        });

        it('should fail with no header found', async () => {
            const isAuthData = isAuthenticated.resolve();

            const req = {
                headers: {}
            } as any;
            const res = {} as any;
            const next = jest.fn() as any;

            try {
                await isAuthData(req, res, next);
            } catch (c) {
                expect(c.message).toBe('Unauthorized');
                expect(c.status).toBe(401);
            }
        });

        it('should call jwt with correct token', async () => {
            const isAuthData = isAuthenticated.resolve();
            const token = '4r5t6y7ujhgfde4r5t6y7ujnbhvfctgyhujmnbvfgyhuj';

            const req = {
                headers: {
                    authorization: `Bearer ${token}`
                }
            } as any;

            const res = {} as any;
            const next = jest.fn() as any;

            try {
                await isAuthData(req, res, next);
            } catch (e) {
                expect((jwt.verify as jest.Mock)).toHaveBeenCalledTimes(1);
                expect((jwt.verify as jest.Mock).mock.calls[0][0]).toBe(token);
            }
        });

        it('should fail with TokenExpiredError', async () => {
            Object.defineProperty(jwt, 'verify', {value: jest.fn(() => {
                    throw {name: 'TokenExpiredError'};
                })
            });

            const isAuthData = isAuthenticated.resolve();
            const token = '4r5t6y7ujhgfde4r5t6y7ujnbhvfctgyhujmnbvfgyhuj';

            const req = {
                headers: {
                    authorization: `Bearer ${token}`
                }
            } as any;

            const res = {} as any;
            const next = jest.fn() as any;

            try {
                await isAuthData(req, res, next);
            } catch (e) {
                expect((jwt.verify as jest.Mock)).toHaveBeenCalledTimes(1);
                expect(e.message).toBe('Expired token');
                expect(e.status).toBe(401);

            }
        });

        it('should fail with Authentication Error due to token', async () => {
            Object.defineProperty(jwt, 'verify', {value: jest.fn(() => {
                    throw {name: 'Generic'};
                })
            });

            const isAuthData = isAuthenticated.resolve();
            const token = '4r5t6y7ujhgfde4r5t6y7ujnbhvfctgyhujmnbvfgyhuj';

            const req = {
                headers: {
                    authorization: `Bearer ${token}`
                }
            } as any;

            const res = {} as any;
            const next = jest.fn() as any;

            try {
                await isAuthData(req, res, next);
            } catch (e) {
                expect((jwt.verify as jest.Mock)).toHaveBeenCalledTimes(1);
                expect(e.message).toBe('Authentication Error');
                expect(e.status).toBe(401);

            }
        });

        it('should fail with Authentication Error due to missing user', async () => {
            Object.defineProperty(jwt, 'verify', {value: jest.fn(() => {
                    return {
                        _id: 'de56yhnjk'
                    };
                })
            });

            authService.validateUser = jest.fn(() => Promise.reject({err: 'Generic'}));

            const isAuthData = isAuthenticated.resolve();
            const token = '4r5t6y7ujhgfde4r5t6y7ujnbhvfctgyhujmnbvfgyhuj';

            const req = {
                headers: {
                    authorization: `Bearer ${token}`
                }
            } as any;

            const res = {} as any;
            const next = jest.fn() as any;

            try {
                await isAuthData(req, res, next);
            } catch (e) {
                expect((authService.validateUser as jest.Mock)).toHaveBeenCalledTimes(1);
                expect(e.message).toBe('Authentication Error');
                expect(e.status).toBe(401);

            }
        });

        it('should call the next with no error', async () => {
            Object.defineProperty(jwt, 'verify', {value: jest.fn(() => {
                    return {
                        _id: 'de56yhnjk'
                    };
                })
            });

            authService.validateUser = jest.fn(() => Promise.resolve(true));

            const isAuthData = isAuthenticated.resolve();
            const token = '4r5t6y7ujhgfde4r5t6y7ujnbhvfctgyhujmnbvfgyhuj';

            const req = {
                headers: {
                    authorization: `Bearer ${token}`
                }
            } as any;

            const res = {} as any;
            const next = jest.fn() as any;

            await isAuthData(req, res, next);

            expect((authService.validateUser as jest.Mock)).toHaveBeenCalledTimes(1);
            expect((authService.validateUser as jest.Mock).mock.calls[0][0]).toBe('de56yhnjk');
            expect(next).toHaveBeenCalledTimes(1);
        });
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });

    afterAll(async () => {
        jest.restoreAllMocks();
    });
});