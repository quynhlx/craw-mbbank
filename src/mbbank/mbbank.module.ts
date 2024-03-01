import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MbbankService } from './mbbank.service';
import { MbbankController } from './mbbank.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MBMiddleware } from './middlewares/mb.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register(),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('MBBANK_URL'),
        headers: {
          Authorization: configService.get('MBBANK_HEADER_AUTH'),
          'Content-Type': 'application/json; charset=UTF-8',
          DNT: 1,
        },
        
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MbbankController],
  providers: [MbbankService, UserService],
})
export class MbbankModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MBMiddleware)
      .exclude(
        { path: 'mbbank/users', method: RequestMethod.ALL },
      )
      .forRoutes(MbbankController);
  }
}
