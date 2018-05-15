import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersModule } from '../user/user.module';
import { IsAuthenticated, EnableCORS } from './auth.middleware';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FacebookProvider } from './authProviders/facebook.provider';
import { GoogleProvider } from './authProviders/google.provider';
import { authenticate } from 'passport';
import { LocalStrategy } from './authProviders/local.provider';
import { ROUTE_PREFIX } from '../app.constants';

@Module({
    imports: [
        forwardRef(() => UsersModule)
    ],
    providers: [AuthService, IsAuthenticated, FacebookProvider, GoogleProvider, LocalStrategy],
    controllers: [AuthController],
    exports: [IsAuthenticated]
})
export class AuthModule implements NestModule {
    constructor() {

    }

    configure(consumer: MiddlewareConsumer): void {
        /*consumer.apply(EnableCORS).forRoutes(
            { path: '/auth/facebook', method: RequestMethod.ALL },
            { path: '/auth/facebook/callback', method: RequestMethod.ALL },
        );*/

        consumer.apply(authenticate('local-signup', { session: false, passReqToCallback: true }))
            .forRoutes({ path: `${ROUTE_PREFIX}/auth/register`, method: RequestMethod.POST } as any);

        consumer
            .apply(authenticate('local-signin', { session: false }))
            .forRoutes({ path: `${ROUTE_PREFIX}/auth/login`, method: RequestMethod.POST } as any);

        consumer
            .apply(authenticate('facebook', { session: false }))
            .forRoutes({ path: `${ROUTE_PREFIX}/auth/facebook/token`, method: RequestMethod.POST } as any);

        consumer
            .apply(authenticate('google', { session: false }))
            .forRoutes({ path: `${ROUTE_PREFIX}/auth/google/token`, method: RequestMethod.POST } as any);

    }
}