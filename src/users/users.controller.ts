import { Controller, Get } from '@nestjs/common';
import {promisify} from 'util';

function _check(cb) {
    cb(null, 1, 2);
}

@Controller('users')
export class UsersController {
    constructor() {}

    @Get('authorized')
    public async authorized() {
        const _checkAsync = promisify(_check);
        let ans1, ans2;

        console.log(await _checkAsync());



        return '123';
    }
}