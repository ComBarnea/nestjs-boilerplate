import { AuthService } from './auth.service';

describe('Auth Service', () => {
    let usersService: any = {};
    let facebookProvider: any = {};
    let authService: AuthService;

    beforeEach(async () => {
        authService = new AuthService(usersService, facebookProvider);
    });

    it('createToken', async () => {
        authService
    });
});