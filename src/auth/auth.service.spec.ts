jest.setMock('jsonwebtoken', {
    sign: jest.fn(() => 'access_token')
});
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';

describe('Auth Service', () => {
    let authService: AuthService;
    let usersService: any;
    let facebookProvider: any;
    let googleProvider: any;

    beforeEach(async () => {
        usersService = {
            validateUser: jest.fn(() => Promise.resolve(true)),
            findUserForLogin: jest.fn(),
            findUserByEmail: jest.fn(),
            create: jest.fn(() => Promise.resolve(true))
        };

        facebookProvider = {
            init: jest.fn(),
            requestProviderRedirectUri: jest.fn(),
            requestProviderLogIn: jest.fn(),
        };

        googleProvider = {
            init: jest.fn(),
            requestProviderRedirectUri: jest.fn(),
            requestProviderLogIn: jest.fn(),
        };
        authService = new AuthService(usersService, facebookProvider, googleProvider);
    });

    describe('validateUser', () => {
        it('should validate the user', async () => {
            const isValid = await authService.validateUser('id1');

            expect(usersService.validateUser).toHaveBeenCalledTimes(1);
            expect(usersService.validateUser.mock.calls[0][0]).toBe('id1');
            expect(isValid).toBe(true);
        });
    });

    describe('providerLogin', () => {

    });

    describe('facebook', () => {

    });

    afterAll(async () => {
        jest.restoreAllMocks();
    });
});