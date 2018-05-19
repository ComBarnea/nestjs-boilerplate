import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthCreateInterceptor, AuthValidationInterceptor } from './auth.interceptors';
import { AuthorizationService } from './authorization.service';
import { RepositoryModule } from '../repository/repository.module';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [
        CommonModule,
        RepositoryModule
    ],
    controllers: [],
    providers: [AuthCreateInterceptor, AuthValidationInterceptor, AuthorizationService],
    exports: [AuthCreateInterceptor, AuthValidationInterceptor, AuthorizationService]
})
export class AuthorizationModule implements NestModule {
    constructor() {

    }

    configure(consumer: MiddlewareConsumer): void {}
}