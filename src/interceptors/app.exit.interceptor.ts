import { NestInterceptor, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ExitInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, stream$: Observable<any>): Observable<any> {

        return stream$.
        pipe(
            map((data) => {
                return {data};
            })
        )
        .pipe(
            catchError((e) => {
                if (e instanceof  HttpException) {
                    return throwError(e);
                } else {
                    return throwError(new HttpException('Internal Error', 500));
                }
            })
        );
    }
}