import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

const appPort = process.env.APP_PORT || 3001

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(appPort, () => {
    console.log('server is now running at port: ' + appPort)
  })
}
bootstrap()
