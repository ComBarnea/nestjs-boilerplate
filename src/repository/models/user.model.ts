import { UserSchema } from '../schemas/user.schema';
import { APP_TOKENS } from '../../app.constants';
import { MongooseModule } from '@nestjs/mongoose';

export const UserModel = MongooseModule.forFeature([{
    name: APP_TOKENS.userModel,
    schema: UserSchema
}]);