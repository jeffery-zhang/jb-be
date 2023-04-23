import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

import { GlobalExceptionFilter } from './shared/filters/exception.filter'
import { BodyInterceptor } from './shared/interceptors/body.interceptor'

const appPort = process.env.APP_PORT || 3001

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('jbapi')
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalInterceptors(new BodyInterceptor())

  await app.listen(appPort, () => {
    console.log('server is now running at port: ' + appPort)
  })
}
bootstrap()
