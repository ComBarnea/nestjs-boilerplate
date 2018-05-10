import { forwardRef, MiddlewaresConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersModule } from '../user/user.module';
import { IsAuthenticated, EnableCORS } from './auth.middleware';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FacebookProvider } from './authProviders/facebook.provider';
import { GoogleProvider } from './authProviders/google.provider';
import { authenticate } from 'passport';
import { LocalStrategy } from './authProviders/local.provider';

@Module({
    imports: [
        forwardRef(() => UsersModule)
    ],
    components: [AuthService, IsAuthenticated, FacebookProvider, GoogleProvider, LocalStrategy],
    controllers: [AuthController],
    exports: [IsAuthenticated]
})
export class AuthModule {
    constructor() {

    }

    configure(consumer: MiddlewaresConsumer): void {
        /*consumer.apply(EnableCORS).forRoutes(
            { path: '/auth/facebook', method: RequestMethod.ALL },
            { path: '/auth/facebook/callback', method: RequestMethod.ALL },
        );*/

        consumer.apply(authenticate('local-signup', { session: false, passReqToCallback: true }))
            .forRoutes({ path: '/auth/register', method: RequestMethod.POST });

        consumer
            .apply(authenticate('local-signin', { session: false }))
            .forRoutes({ path: '/auth/login', method: RequestMethod.POST });

        consumer
            .apply(authenticate('facebook', { session: false }))
            .forRoutes({ path: '/auth/facebook/token', method: RequestMethod.POST });

        consumer
            .apply(authenticate('google', { session: false }))
            .forRoutes({ path: '/auth/google/token', method: RequestMethod.POST });

    }
}