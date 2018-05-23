import { UserSchema } from './user.schema';
import * as bcrypt from 'bcrypt';

describe('UserSchema', () => {
    const orgCompare = bcrypt.compare;

    beforeEach(async () => {
        Object.defineProperty(bcrypt, 'compare', {value: jest.fn(() => Promise.resolve(true))});
    });

    afterEach(async () => {
        Object.defineProperty(bcrypt, 'compare', {value: orgCompare});
    });

    describe('Check compare password', () => {
        it('should called with correct data', async () => {
            const answer = await UserSchema.methods.comparePassword('34567');

            expect((bcrypt.compare)).toHaveBeenCalledTimes(1);
            expect((bcrypt.compare as jest.Mock).mock.calls[0][0]).toBe('34567');
            expect(answer).toBe(true);
        });

        it('should throw error', async () => {
            Object.defineProperty(bcrypt, 'compare', {value: jest.fn(() => Promise.reject(true))});

            try {
                await UserSchema.methods.comparePassword('34567');
            } catch (e) {
                expect((bcrypt.compare)).toHaveBeenCalledTimes(1);
                expect(e.err).toBe('Error validating password');
            }
        });
    });
});