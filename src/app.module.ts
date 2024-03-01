import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MbbankModule } from './mbbank/mbbank.module';

@Module({
  imports: [MbbankModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
