import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export class ResponseBody {
  success: boolean
  message: string
  status: HttpStatus
  data: any

  constructor(
    success: boolean,
    message: string,
    status: HttpStatus,
    data: any,
  ) {
    this.success = success
    this.message = message
    this.status = status
    this.data = data
  }
}

@Injectable()
export class BodyInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseBody> {
    return next.handle().pipe(
      map((data) => {
        const res = context.switchToHttp().getResponse()
        const status = res.statusCode
        const success = status >= 200 && status < 300
        const message = success && data.message ? data.message : ''
        return new ResponseBody(success, message, status, data)
      }),
    )
  }
}
