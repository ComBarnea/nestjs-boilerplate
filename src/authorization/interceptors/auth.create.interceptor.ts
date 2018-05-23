import { Injectable, NestInterceptor, ExecutionContext, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { APP_REFLECTOR_TOKENS, APP_TOKENS } from '../../app.constants';

import * as _ from 'lodash';
import { RepositoryService } from '../../repository/repository.service';
import { UserModel } from '../../user/user.provider';
import { ISingleAuth } from '../../repository/schemas/authorization.partial.schema';
import { AuthorizationService } from '../authorization.service';

function defaultBefPipe(answer) {
    return answer.data;
}

@Injectable()
export class AuthCreateInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        @Inject(AuthorizationService) private authorizationService: AuthorizationService,
        @Inject(RepositoryService) private repositoryService: RepositoryService) {

    }

    intercept(
        context: ExecutionContext,
        call$: Observable<any>,
    ): Observable<any> {
        const modelString = this.reflector.get<string>(APP_REFLECTOR_TOKENS.modelType, context.getHandler());
        const user = context.switchToHttp().getRequest().user;
        const befPipeFunction = this.reflector.get<Function>(APP_REFLECTOR_TOKENS.befPipe, context.getHandler()) || defaultBefPipe;
        const requestedRoles = this.reflector.get<string[]>(APP_REFLECTOR_TOKENS.authRoles, context.getHandler());

        return call$.pipe(
            map(async (ans) => {
                const extData = befPipeFunction(ans);
                if (!modelString) return ans;

                const currentModel = this.repositoryService.getModel(modelString);

                await this.addAuthData(currentModel, extData, user, requestedRoles);

                return ans;
            }),
        );
    }

    async addAuthData(model, extractedData, user: UserModel, requestedRoles?: string[]) {
        const nExtractedData = _.cloneDeep(extractedData);

        const findConditions = {
            _id: nExtractedData._id
        };

        const foundData = await model.findOne(findConditions).exec();

        if (!foundData.authorization) return;
        if (foundData.authorization.length) return;

        if (!user.authorization) return;
        let authSArray: ISingleAuth[];

        if (!user.authorization.length) {
            const groups = await this.authorizationService.addUserBasicGroups(user);

            authSArray = groups.map((g) => {
                return {
                    parentId: String(user._id),
                    parentType: APP_TOKENS.userModel,
                    groupId: String(g._id),
                    rules: {
                        view: true,
                        edit: true,
                        remove: true,
                        create: true,
                        editRules: []
                    }
                };
            });

            if (requestedRoles && requestedRoles.length) {
                const addEveryone = requestedRoles.find((s) => s === 'everyone');

                if (addEveryone) {
                    authSArray.push({
                        parentId: String(user._id),
                        parentType: APP_TOKENS.userModel,
                        groupId: 'everyone',
                        rules: {
                            view: true,
                            edit: false,
                            remove: false,
                            create: false,
                            editRules: []
                        }
                    });

                }
            }
        } else {
            authSArray = user.authorization;
        }

        await model.update(findConditions, {$set: {authorization: authSArray}});
    }

}
