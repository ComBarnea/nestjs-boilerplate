import { Injectable, NestInterceptor, ExecutionContext, Inject, ForwardReference, forwardRef } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { RepositoryService } from '../../repository/repository.service';

import { AuthorizationService } from '../authorization.service';
import { APP_REFLECTOR_TOKENS, APP_TOKENS } from '../../app.constants';
import { IServerRequest } from '../../types/main.types';
import * as httpContext from 'express-http-context';

@Injectable()
export class AuthValidationInterceptor implements NestInterceptor {
    constructor(private readonly reflector: Reflector,
                @Inject(AuthorizationService) private authorizationService: AuthorizationService,
                @Inject(RepositoryService) private repositoryService: RepositoryService){

    }

    async intercept(
        context: ExecutionContext,
        call$: Observable<any>,
    ) {
        const authPermissions: string[] = this.reflector.get<string[]>(APP_REFLECTOR_TOKENS.authPermission, context.getHandler());
        const request: IServerRequest = context.switchToHttp().getRequest();
        const user = request.user;
        const foundGroups = await this.authorizationService.getUserGroups(user._id);

        if (authPermissions && authPermissions.length) {
            const partialAuthQuery = await this.authorizationService.constructAuthQueryPart(foundGroups, authPermissions.map((a) => {
                return {
                    name: a
                };
            }));

            httpContext.set(APP_TOKENS.partialAuthQuery, partialAuthQuery);
        }

        return call$.pipe(
            map(async (ans) => {

                return ans;
            }),
        );
    }
}
