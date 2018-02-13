import { UsersService } from './user.service';
import { ICreateUser } from './user.interface';

describe('User Service', () => {
    let userService: UsersService;
    let userModel: any;
    let userRepo;

    beforeEach(async () => {
        userModel =  {
            create: jest.fn(),
            findById: jest.fn(),
        };

        userRepo = {
            id1: {
                _id: 'id1',
                firstName: 'test',
                email: 'test@test.com',
                password: '3456789',
                lastName: 'test'
            },
            id2: {
                _id: 'id2',
                firstName: 'tes2t',
                email: 'tes2t@test.com',
                password: '3456789',
                lastName: 'test2'
            }
        };
        userService = new UsersService(userModel);
    });

    describe('create', () => {
        it('should throw missing email', async () => {
            try {
                await userService.create({firstName: 'test'} as any);
            } catch (c) {
                expect(c.message).toBe('Email is required');
                expect(c.status).toBe(422);
            }
        });

        it('should throw invalid password', async () => {
            try {
                await userService.create({firstName: 'test', email: 'test@test.com', password: '4rfgb'});
            } catch (c) {
                expect(c.message).toBe('Password no good.');
                expect(c.status).toBe(400);
            }
        });

        it('should create user', async () => {
            const user: ICreateUser = {
                firstName: 'test',
                email: 'test@test.com',
                lastName: 'test'
            };

            userModel.create = jest.fn(() => Promise.resolve(user));

            const userAnswer = await userService.create(user);

            expect(userModel.create).toHaveBeenCalledTimes(1);
            expect(userModel.create.mock.calls[0][0].firstName).toBe(user.firstName);
            expect(userModel.create.mock.calls[0][0].email).toBe(user.email);
            expect(userAnswer.firstName).toBe(user.firstName);
            expect(userAnswer.email).toBe(user.email);
        });

        it('should create user with hashed password', async () => {
            const user: ICreateUser = {
                firstName: 'test',
                email: 'test@test.com',
                password: '3456789',
                lastName: 'test'
            };

            userModel.create = jest.fn(() => Promise.resolve(user));

            await userService.create(user);

            expect(userModel.create).toHaveBeenCalledTimes(1);
            expect(userModel.create.mock.calls[0][0].password).not.toBe('3456789');
        });
    });

    describe('validateUser', () => {
        it('should return user', async () => {
            userModel.findById = jest.fn(() => Promise.resolve(userRepo['id1']));

            const foundUser = await userService.validateUser('id1');

            expect(foundUser).toBe(true);
            expect(userModel.findById).toHaveBeenCalledTimes(1);
        });

        it('should throw invalid user', async () => {
            try {
                userModel.findById = jest.fn(() => Promise.resolve(userRepo['id3']));

                const foundUser = await userService.validateUser('id3');
            } catch (e) {
                expect(e.err).toBe('Invalid user.');
                expect(userModel.findById).toHaveBeenCalledTimes(1);
            }

        });
    });

    describe('findUserForLogin', () => {

    });

    describe('findUserById', () => {

    });

    describe('findUserByEmail', () => {

    });

    describe('findUserByProvider', () => {

    });

    describe('updateOne', () => {

    });

});