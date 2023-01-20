import { Module } from '@nestjs/common';
import { HelperService } from 'src/helper/helper.service';
import { MwccController } from './mwcc.controller';
import { MwccService } from './mwcc.service';

@Module({
  controllers: [MwccController],
  providers: [MwccService, HelperService]
})
export class MwccModule {}
