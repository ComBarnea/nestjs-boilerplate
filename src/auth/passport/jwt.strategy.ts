import * as passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {Component, HttpException, HttpStatus, Inject} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Component()
export class JwtStrategy extends Strategy {
    constructor(private readonly authService: AuthService) {

        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                passReqToCallback: true,
                secretOrKey: process.env.SECRET
            },
            async (req, payload, next) => await this.verify(req, payload, next),
        );

        passport.use(this);
    }

    public async verify(req, payload, done) {
        try {
            const isValid = await this.authService.validateUser(payload._id);

            if (!isValid) {
                return done(new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED), false);
            }
            done(null, payload);
        } catch (e) {
            return done(new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED), false);
        }
    }
}