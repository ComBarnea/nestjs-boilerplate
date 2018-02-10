import * as requestLib from 'request';
import { HttpException } from '@nestjs/common';

// TODO: we should try and replace that with facebook js SDK if we can
export function wrappedRequest(params): Promise<{response: any, data: any}> {
    return new Promise((resolve) => {
        requestLib.get(params, (err, response, data) => {
            if (err) throw err;
            if (response.statusCode !== 200) throw new HttpException(data.error.message, 401);

            resolve({response, data});
        });
    });
}