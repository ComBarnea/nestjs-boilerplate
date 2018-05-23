import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { UserModel } from './models/user.model';
import { AuthGroupSchema } from './schemas/authGroup.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_TOKENS } from '../app.constants';
import { CommonModule } from '../common/common.module';
import { AuthGroupModel } from './models/authGroup.model';

@Module({
    imports: [
        // mongoose models
        UserModel,
        AuthGroupModel,
        // normal imports
        CommonModule,
    ],
    providers: [RepositoryService],
    exports: [RepositoryService]
})
export class RepositoryModule implements NestModule {
    constructor() {}
    public configure(consumer: MiddlewareConsumer) {}
}
