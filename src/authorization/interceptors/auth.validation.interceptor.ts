import { Injectable, NestInterceptor, ExecutionContext, Inject, ForwardReference, forwardRef } from '@nestjs/common';
import { Observable } from 'rxjs';
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
        const authRules: string[] = this.reflector.get<string[]>(APP_REFLECTOR_TOKENS.authRoles, context.getHandler());
        const authParentPipe: [string, Function] = this.reflector.get<[string, Function]>(APP_REFLECTOR_TOKENS.authParentPipe, context.getHandler());
        const request: IServerRequest = context.switchToHttp().getRequest();

        const user = request.user;

        const foundGroups = user ? await this.authorizationService.getUserGroups(user._id) : [];

        // TODO: add fine grain control over this
        foundGroups.push('everyone');

        if (authPermissions && authPermissions.length) {
            const partialAuthQuery = await this.authorizationService.constructAuthQueryPart(foundGroups, authPermissions.map((a) => {
                return {
                    name: a
                };
            }));

            httpContext.set(APP_TOKENS.partialAuthQuery, partialAuthQuery);
        }

        if (authParentPipe && authParentPipe.length) {
            httpContext.set(APP_TOKENS.partialAuthParent, authParentPipe[1](request[authParentPipe[0]]));
        }

        return call$;
    }
}
