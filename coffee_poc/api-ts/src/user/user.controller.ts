import { Body, Controller, Post, Req, Res, Response } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto/user.dto';
import { AdminDto } from './dto/admin.dto/admin.dto';

@Controller('register')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/admin')
  async registerAdmin(
    @Req() req,
    @Body() adminBody: AdminDto,
    @Response() res,
  ) {
    try {
      let org = adminBody.orgName;
      console.log(org);
      await this.userService.enrollAdmin(org);
      res.json({
        message: 'Successfully enrolled admin and imported it into the wallet',
      });
    } catch (err) {
      throw err;
    }
  }

  @Post('/user')
  async registerUser(@Body() usrBody: UserDto, @Response() res) {
    try {
      let usrname = usrBody.username;
      let orgName = usrBody.orgName;
      console.log(orgName);
      console.log(usrname);
      let resp = await this.userService.registerEnrollUser(usrname, orgName);
      // let resp = await helper.getRegisteredUser(usrname, orgName, true);
      res.json({
        message: 'Successfully enrolled User and imported it into the wallet',
      });
    } catch (err) {
      throw err;
    }
  }
}
