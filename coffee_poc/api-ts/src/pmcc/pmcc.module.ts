import { Module } from '@nestjs/common';
import { PmccService } from './pmcc.service';
import { PmccController } from './pmcc.controller';
import { HelperService } from 'src/helper/helper.service';

@Module({
  providers: [PmccService, HelperService],
  controllers: [PmccController]
})
export class PmccModule {}
