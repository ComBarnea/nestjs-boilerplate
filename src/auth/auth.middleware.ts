import { NestMiddleware, HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as cors from 'cors';
import * as jwt from 'jsonwebtoken';
import * as httpContext from 'express-http-context';
import { UsersService } from '../user/user.service';

@Injectable()
export class IsAuthenticated implements NestMiddleware {
    constructor(@Inject(UsersService) private usersService: UsersService) {}

    resolve() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const user = httpContext.get('user');
            if (!user) throw new HttpException('Authentication Error', HttpStatus.UNAUTHORIZED);

            return next();
        };
    }
}

@Injectable()
export class JWTParse implements NestMiddleware {
    constructor(@Inject(UsersService) private usersService: UsersService) {}

    resolve() {
        return async (req: Request, res: Response, next: NextFunction) => {
            if (req.headers.authorization && (req.headers.authorization as string).split(' ')[0] === 'Bearer') {
                const token = (req.headers.authorization as string).split(' ')[1];
                let decoded: any;

                try {
                    decoded = jwt.verify(token, process.env.SECRET, process.env.NODE_ENV === 'dev' ? {ignoreExpiration: true} : {ignoreExpiration: false});

                } catch (e) {
                    if (e.name === 'TokenExpiredError') throw new HttpException('Expired token', HttpStatus.UNAUTHORIZED);
                    throw new HttpException('Authentication Error', HttpStatus.UNAUTHORIZED);
                }

                try {
                    await this.usersService.validateUser(decoded._id);
                } catch (e) {
                    throw new HttpException('Authentication Error', HttpStatus.UNAUTHORIZED);
                }

                req.user = decoded;
                httpContext.set('user', decoded);

                return next();
            } else {
                return next();
            }
        };
    }
}

// TODO: change to facebook CORS
@Injectable()
export class EnableCORS implements NestMiddleware {
    resolve() {
        return async (req: Request, res: Response, next: NextFunction) => {
            return cors({
                origin: '*',
                withCredentials: false,
                allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Content-Disposition']
            })(req, res, next);
        };
    }
}
