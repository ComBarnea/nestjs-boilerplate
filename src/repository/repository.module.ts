import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { UserModel } from '../user/user.model';
import { AuthGroupSchema } from '../authorization/schemas/authGroup.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_TOKENS } from '../app.constants';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [
        UserModel,
        CommonModule,
        MongooseModule.forFeature([{
            name: APP_TOKENS.authGroupsModel,
            schema: AuthGroupSchema
        }]),
    ],
    providers: [RepositoryService],
    exports: [RepositoryService]
})
export class RepositoryModule implements NestModule {
    constructor() {}
    public configure(consumer: MiddlewareConsumer) {}
}
