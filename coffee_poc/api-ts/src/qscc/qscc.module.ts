import { Module } from '@nestjs/common';
import { HelperService } from 'src/helper/helper.service';
import { QsccController } from './qscc.controller';
import { QsccService } from './qscc.service';

@Module({
  controllers: [QsccController],
  providers: [QsccService, HelperService]
})
export class QsccModule {}
