import { AuthGroupSchema } from '../schemas/authGroup.schemas';
import { APP_TOKENS } from '../../app.constants';
import { MongooseModule } from '@nestjs/mongoose';

export const AuthGroupModel = MongooseModule.forFeature([{
    name: APP_TOKENS.authGroupsModel,
    schema: AuthGroupSchema
}]);