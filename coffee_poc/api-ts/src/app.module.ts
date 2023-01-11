import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { HelperService } from './helper/helper.service';
import { HelperModule } from './helper/helper.module';

@Module({
  imports: [UserModule, HelperModule],
  controllers: [AppController],
  providers: [AppService, HelperService],
})
export class AppModule {}
