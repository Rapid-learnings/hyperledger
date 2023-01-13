import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HelperService } from 'src/helper/helper.service';
import {HelperModule} from '../helper/helper.module'

@Module({
  imports:[HelperModule],
  providers: [UserService, HelperService],
  controllers: [UserController]
})
export class UserModule {}
