import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule as ScheduleModuleLib } from '@nestjs/schedule'

import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { CategoriesModule } from './categories/categories.module'
import { TagsModule } from './tags/tags.module'
import { PostsModule } from './posts/posts.module'
import { CommentsModule } from './comments/comments.module'
import { RepliesModule } from './replies/replies.module'
import { MinioModule } from './minio/minio.module'
import { SettingsModule } from './settings/settings.module'
import { ScheduleModule } from './schedule/schedule.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        console.log(
          'connect to mongodb with uri: ',
          configService.get('DB_FULLPATH'),
        )
        return {
          uri: configService.get('DB_FULLPATH'),
        }
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    TagsModule,
    PostsModule,
    CommentsModule,
    RepliesModule,
    MinioModule,
    SettingsModule,
    ScheduleModule,
    ScheduleModuleLib.forRoot(),
  ],
  controllers: [AppController],
})
export class AppModule {}
