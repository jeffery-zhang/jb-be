import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'

import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './shared/filters/exception.filter'
import { BodyInterceptor } from './shared/interceptors/body.interceptor'
import { CustomValidatePipe } from './shared/pipes/validate.pipe'

const appPort = process.env.APP_PORT || 3001

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('jbapi')
  app.useGlobalPipes(new CustomValidatePipe())
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalInterceptors(new BodyInterceptor())
  app.use(helmet())

  await app.listen(appPort, () => {
    console.log('server is now running on port: ' + appPort)
  })
}
bootstrap()
