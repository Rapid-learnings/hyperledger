import { Controller, Get, Req, Response } from '@nestjs/common';
import { QsccService } from './qscc.service';

@Controller('qscc')
export class QsccController {
  constructor(private queryObj: QsccService) {}
  @Get('/channels/:channelName/chaincodes/:chaincodeName')
  async queryQscc(@Req() req, @Response() res) {
    try {
      console.log('==================== QUERY BY CHAINCODE ==================');

      let channelName = req.params.channelName;
      let chaincodeName = req.params.chaincodeName;

      console.log(`chaincode name is :${chaincodeName}`);
      let args = req.query.args;
      let fcn = req.query.fcn;
      // let peer = req.query.peer;

      console.log('channelName : ' + channelName);
      console.log('chaincodeName : ' + chaincodeName);
      console.log('fcn : ' + fcn);
      console.log('args : ' + args);

      if (!chaincodeName) {
        throw new Error('Chaincode name missing');
      }
      if (!channelName) {
        throw new Error('Channel name missing');
      }
      if (!fcn) {
        throw new Error('Function name missing');
      }
      if (!args) {
        throw new Error('Arguments are missing missing');
      }
      // console.log('args==========', args);
      // args = args.replace(/'/g, '"');
      // args = JSON.parse(args);
      // console.log(args);

      let response_payload = await this.queryObj.qscc(
        channelName,
        chaincodeName,
        args,
        fcn,
        req.query.username,
        req.query.orgname,
      );
      // let response = Buffer.from(JSON.parse(JSON.stringify(response_payload))).toString()
      res.send(response_payload);
    } catch (error) {
      const response_payload = {
        result: null,
        error: error.name,
        errorData: error.message,
      };
      res.send(response_payload);
    }
  }
}
