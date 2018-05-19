import * as requestLib from 'request';
import { HttpException } from '@nestjs/common';

// TODO: we should try and replace that with facebook js SDK if we can
export function wrappedRequest(params): Promise<{response: any, data: any}> {
    return new Promise((resolve) => {
        requestLib(params, (err, response, data) => {
            if (err) throw err;

            if (!(response.statusCode === 200 || response.statusCode === 201)) {
                if (data.error) throw new HttpException(data.error.message, 401);

                throw new HttpException('Internal Error', 401);
            }

            resolve({response, data});
        });
    });
}

export function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);

        return v.toString(16);
    });
}

export function syncTimeOut(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}