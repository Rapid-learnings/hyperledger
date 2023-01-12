import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { HelperService } from './helper/helper.service';
import { HelperModule } from './helper/helper.module';
import { QsccModule } from './qscc/qscc.module';
import { PmccModule } from './pmcc/pmcc.module';
import { MwccModule } from './mwcc/mwcc.module';
import { WrccService } from './wrcc/wrcc.service';
import { WrccController } from './wrcc/wrcc.controller';
import { WrccModule } from './wrcc/wrcc.module';
import { MwccController } from './mwcc/mwcc.controller';
import { MwccService } from './mwcc/mwcc.service';

@Module({
  imports: [UserModule, HelperModule, QsccModule, PmccModule, MwccModule, WrccModule],
  controllers: [AppController, WrccController, MwccController],
  providers: [AppService, HelperService, WrccService, MwccService],
})
export class AppModule {}
