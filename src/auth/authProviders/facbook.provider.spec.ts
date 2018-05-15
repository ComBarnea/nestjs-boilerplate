import { FacebookProvider } from './facebook.provider';
import * as utils from '../../utils';

describe('Facebook provider', () => {
    let facebookProvider: FacebookProvider;
    const orgWrapped = utils.wrappedRequest;
    let userService: any;
    beforeEach(async () => {
        userService = {};

        facebookProvider = new FacebookProvider(userService);
    });

    afterEach(async () => {
        Object.defineProperty(utils, 'wrappedRequest', {value: orgWrapped});
    });

    /*describe('authentication', () => {
        it('should return expected output', async () => {
            const dataAnswer = {
                first_name: 'firstName',
                last_name: 'lastName',
                email: 'first@last.com',
                gender: 1,
                id: 'e5r6tbtvf'
            };

            Object.defineProperty(utils, 'wrappedRequest', {value: jest.fn(() => Promise.resolve({data: dataAnswer}))});

            const answer = await facebookProvider.authentication('ertyumnbvcdrtyhn');

            expect(utils.wrappedRequest).toHaveBeenCalledTimes(1);
            expect((utils.wrappedRequest as jest.Mock).mock.calls[0][0].qs.access_token).toBe('ertyumnbvcdrtyhn');
            expect(answer.providerToken).toBe('ertyumnbvcdrtyhn');
            expect(answer.providerId).toBe(dataAnswer.id);
            expect(answer.providerType).toBe('facebook');
            expect(answer.user.email).toBe(dataAnswer.email);
        });
    });

    describe('getAccessToken', () => {
        it('should return expected output', async () => {
            const dataAnswer = {
                access_token: 'w34567ujhfr67'
            };

            Object.defineProperty(utils, 'wrappedRequest', {value: jest.fn(() => Promise.resolve({data: dataAnswer}))});

            const answer = await facebookProvider.getAccessToken('sdfgyhujikol', 'e5r6tbtvf', 'urlcallback');

            expect(utils.wrappedRequest).toHaveBeenCalledTimes(1);
            expect((utils.wrappedRequest as jest.Mock).mock.calls[0][0].qs.client_id).toBe('e5r6tbtvf');
            expect((utils.wrappedRequest as jest.Mock).mock.calls[0][0].qs.code).toBe('sdfgyhujikol');

            expect(answer).toBe(dataAnswer.access_token);
        });
    });*/
});