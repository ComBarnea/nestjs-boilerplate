import {forwardRef, MiddlewaresConsumer, Module, RequestMethod} from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { IsAuthenticated, AddFacebookCORS } from './auth.middleware';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtStrategy} from './passport/jwt.strategy';

@Module({
    imports: [
        forwardRef(() => UsersModule)
    ],
    components: [AuthService, IsAuthenticated, JwtStrategy],
    controllers: [AuthController],
    exports: [IsAuthenticated]
})
export class AuthModule {
    constructor() {

    }

    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(AddFacebookCORS).forRoutes(
            { path: '/auth/facebook', method: RequestMethod.ALL },
        );
    }
}