import { forwardRef, MiddlewaresConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersModule } from '../user/user.module';
import { IsAuthenticated, AddFacebookCORS } from './auth.middleware';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FacebookProvider } from './loginProviders/facebook.provider';

@Module({
    imports: [
        forwardRef(() => UsersModule)
    ],
    components: [AuthService, IsAuthenticated, FacebookProvider],
    controllers: [AuthController],
    exports: [IsAuthenticated]
})
export class AuthModule {
    constructor() {

    }

    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(AddFacebookCORS).forRoutes(
            { path: '/auth/facebook', method: RequestMethod.ALL },
            { path: '/auth/facebook/callback', method: RequestMethod.ALL },
        );
    }
}