jest.setMock('jsonwebtoken', {
    sign: jest.fn(() => 'access_token')
});
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';

describe('Auth Service', () => {
    let authService: AuthService;
    let usersService: any;
    let facebookProvider: any;

    beforeEach(async () => {
        usersService = {
            validateUser: jest.fn(() => Promise.resolve(true)),
            findUserForLogin: jest.fn(),
            findUserByEmail: jest.fn(),
            create: jest.fn(() => Promise.resolve(true))
        };
        facebookProvider = {};
        authService = new AuthService(usersService);
    });

    describe('validateUser', () => {
        it('should validate the user', async () => {
            const isValid = await authService.validateUser('id1');

            expect(usersService.validateUser).toHaveBeenCalledTimes(1);
            expect(usersService.validateUser.mock.calls[0][0]).toBe('id1');
            expect(isValid).toBe(true);
        });
    });

    describe('login', () => {
        it('should fail with  no password', async () => {
            try {
                await authService.login('test@test.com', null);
            } catch (e) {
                expect(e.message).toBe('Password is required');
            }
        });

        it('should fail with no mail', async () => {
            try {
                await authService.login(null, 'rghji6567u');
            } catch (e) {
                expect(e.message).toBe('Email is required');
            }
        });

        it('should fail with no user found for login', async () => {
            usersService.findUserForLogin = jest.fn(() => Promise.resolve(null));

            try {
                await authService.login('test@tes.com', 'rghji6567u');
            } catch (e) {
                expect(e.message).toBe('User not found');
            }
        });

        it('should fail with wrong password', async () => {
            const mockedUser = {
                comparePassword: jest.fn(() => Promise.resolve(false))
            };

            usersService.findUserForLogin = jest.fn(() => Promise.resolve(mockedUser));

            try {
                await authService.login('test@tes.com', 'rghji6567u');
            } catch (e) {
                expect(e.message).toBe('Wrong password.');
            }
        });

        it('should fail with no user found with email', async () => {
            const mockedUser = {
                comparePassword: jest.fn(() => Promise.resolve(true))
            };

            usersService.findUserForLogin = jest.fn(() => Promise.resolve(mockedUser));
            usersService.findUserByEmail = jest.fn(() => Promise.resolve(null));

            try {
                await authService.login('test@tes.com', 'rghji6567u');
            } catch (e) {
                expect(e.message).toBe('User not found');
            }
        });

        it('should create token', async () => {
            const mockedUser = {
                comparePassword: jest.fn(() => Promise.resolve(true)),
                email: 'test@tes.com',
                firstName: 'test',
                lastName: 'test',
                _id: 'id1',
                profilePicture: 'picurl'
            };

            usersService.findUserForLogin = jest.fn(() => Promise.resolve(mockedUser));
            usersService.findUserByEmail = jest.fn(() => Promise.resolve(mockedUser));

            const createdToken = await authService.login('test@tes.com', 'rghji6567u');

            expect(jwt.sign).toHaveBeenCalledTimes(1);
            expect(createdToken.access_token).toBe('access_token');

        });
    });

    describe('register', () => {
        it('should fail with user already found', async () => {
            const createData = {
                email: 'test@tes.com',
                password: 'rghji6567u',
            };

            usersService.findUserForLogin = jest.fn(() => Promise.resolve({id: '56yhv'}));
            try {
                await authService.register(createData);
            } catch (e) {
                expect(usersService.findUserForLogin).toHaveBeenCalledTimes(1);
                expect(e.message).toBe('User already found');
                expect(e.status).toBe(409);
            }

        });

        it('should create user', async () => {
            const createData = {
                email: 'test@tes.com',
                password: 'rghji6567u',
            };

            usersService.findUserForLogin = jest.fn(() => Promise.resolve(null));

            const createdToken = await authService.register(createData);

            expect(usersService.findUserForLogin).toHaveBeenCalledTimes(1);
            expect(usersService.create).toHaveBeenCalledTimes(1);
            expect(usersService.create.mock.calls[0][0]).toEqual(createData);
            expect(createdToken.access_token).toBe('access_token');
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