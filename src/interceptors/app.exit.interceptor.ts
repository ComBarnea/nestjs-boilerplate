import { Interceptor, NestInterceptor, ExecutionContext, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Interceptor()
export class ExitInterceptor implements NestInterceptor {
    intercept(dataOrRequest, context: ExecutionContext, stream$: Observable<any>): Observable<any> {

        return stream$.map((data) => {
            return {data};
        }).catch((e) => {
            if (e instanceof  HttpException) {
                return Observable.throw(e);
            } else {
                return Observable.throw(new HttpException('Internal Error', 500));
            }
        });
    }
}