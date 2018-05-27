import { ReflectMetadata } from '@nestjs/common';
import { APP_REFLECTOR_TOKENS } from '../../app.constants';

export const AuthPermissions = (permissions: string[]) => ReflectMetadata(APP_REFLECTOR_TOKENS.authPermission, permissions);
export const ModelType = (modelName: string) => ReflectMetadata(APP_REFLECTOR_TOKENS.modelType, modelName);
export const AuthRoles = (roles: string[]) => ReflectMetadata(APP_REFLECTOR_TOKENS.authRoles, roles);
export const BefPipe = (befFunction: Function) => ReflectMetadata(APP_REFLECTOR_TOKENS.befPipe, befFunction);
export const AuthParentPipe = (authParent: [string, Function]) => ReflectMetadata(APP_REFLECTOR_TOKENS.authParentPipe, authParent);

export interface IAuthParentPipe {
    parentId: string;
    parentType: string;
}