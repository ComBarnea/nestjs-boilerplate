import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        forwardRef(() => UsersModule)
    ],
    components: [AuthService, AuthMiddleware],
    controllers: [AuthController],
    exports: [AuthMiddleware]
})
export class AuthModule {}