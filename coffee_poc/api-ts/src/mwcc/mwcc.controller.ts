import { Body, Controller, Get, Post, Response } from '@nestjs/common';
import { MwccService } from './mwcc.service';
import { mwDto } from './dto/mw.dto';

@Controller()
export class MwccController {
  constructor(private invokeObjMW: MwccService) {}

  @Get('/init-mwcc')
  async initialize(@Response() res) {
    try {
      let txId = await this.invokeObjMW.evaluateTx(
        'mfd-whs-channel',
        'mwcc',
        'initialize',
        'user404',
        'tatastore',
      );
      res.json({ message: `MWCC Initialized & Transaction ID : ${txId}` });
    } catch (err) {
      throw err;
    }
  }

  @Get('/manufacturer/raw-stock-from-pmcc')
  async returnRawStockAccordingToPMCC(@Response() res) {
    try {
      let message = await this.invokeObjMW.evaluateTx(
        'mfd-whs-channel',
        'mwcc',
        'returnRawStockAccordingToPMCC',
        'user101',
        'tata',
      );
      res.json({ message: `manufacturer stock is ${message} Kg` });
    } catch (err) {
      throw err;
    }
  }

  @Get('/manufacturer/dried-stock')
  async availableDriedStock(@Response() res) {
    try {
      let message = await this.invokeObjMW.evaluateTx(
        'mfd-whs-channel',
        'mwcc',
        'availableDriedStock',
        'user101',
        'tata',
      );
      res.json({ message: `manufacturer dried stock is ${message} Kg` });
    } catch (err) {
      throw err;
    }
  }

  @Get('/manufacturer/roasted-stock')
  async availableRoastedStock(@Response() res) {
    try {
      let message = await this.invokeObjMW.evaluateTx(
        'mfd-whs-channel',
        'mwcc',
        'availableRoastedStock',
        'user101',
        'tata',
      );
      res.json({ message: `manufacturer roasted stock is ${message} Kg` });
    } catch (err) {
      throw err;
    }
  }

  @Get('/manufacturer/finished-stock')
  async availableFinishedStock(@Response() res) {
    try {
      let message = await this.invokeObjMW.evaluateTx(
        'mfd-whs-channel',
        'mwcc',
        'availableFinishedStock',
        'user101',
        'tata',
      );
      res.json({ message: `manufacturer finished stock is ${message} Kg` });
    } catch (err) {
      throw err;
    }
  }

  @Get('/manufacturer/wasted-stock')
  async getWastedStock(@Response() res) {
    try {
      let message = await this.invokeObjMW.evaluateTx(
        'mfd-whs-channel',
        'mwcc',
        'getWastedStock',
        'user101',
        'tata',
      );
      res.json({ message: `manufacturer wasted stock is ${message} Kg` });
    } catch (err) {
      throw err;
    }
  }

  @Get('/manufacturer/total-packages')
  async getTotalPackages(@Response() res) {
    try {
      let message = await this.invokeObjMW.evaluateTx(
        'mfd-whs-channel',
        'mwcc',
        'getTotalPackages',
        'user101',
        'tata',
      );
      res.json({ message: `manufacturer total packages is ${message}` });
    } catch (err) {
      throw err;
    }
  }

  @Post('/manufacturer/dry')
  async dry(@Body() body: mwDto, @Response() res) {
    try {
      let username = body.username;
      let org_name = body.org_name;
      let args = body.args;
      let txId = await this.invokeObjMW.dry(
        'mfd-whs-channel',
        'mwcc',
        args,
        username,
        org_name,
      );
      res.json({
        message: `${args[1]} Kg of raw stock dried & Tx Id : ${txId}`,
      });
    } catch (err) {
      throw err;
    }
  }

  @Post('/manufacturer/roast')
  async roast(@Body() body: mwDto, @Response() res) {
    try {
      let username = body.username;
      let org_name = body.org_name;
      let args = body.args;
      let txId = await this.invokeObjMW.roast(
        'mfd-whs-channel',
        'mwcc',
        args,
        username,
        org_name,
      );
      res.json({
        message: `${args[1]} Kg of raw stock roasted & Tx ID : ${txId}`,
      });
    } catch (err) {
      throw err;
    }
  }

  @Post('/manufacturer/doQA')
  async doQA(@Body() body: mwDto, @Response() res) {
    try {
      let username = body.username;
      let org_name = body.org_name;
      let args = body.args;
      let txId = await this.invokeObjMW.doQA(
        'mfd-whs-channel',
        'mwcc',
        args,
        username,
        org_name,
      );
      res.json({
        message: `${args[1]} Kg of raw stock quality checked & Tx ID : ${txId}`,
      });
    } catch (err) {
      throw err;
    }
  }

  @Post('/manufacturer/package')
  async package(@Body() body: mwDto, @Response() res) {
    try {
      let username = body.username;
      let org_name = body.org_name;
      let args = body.args;
      let txId = await this.invokeObjMW.package(
        'mfd-whs-channel',
        'mwcc',
        args,
        username,
        org_name,
      );
      res.json({
        message: `${args[0]} Kg of finished stock is packaged & Tx ID : ${txId}`,
      });
    } catch (err) {
      throw err;
    }
  }

  @Post('/manufacturer/dispatch')
  async dispatch(@Response() res, @Body() body: mwDto) {
    try {
      let username = body.username;
      let org_name = body.org_name;
      let args = body.args;
      let txId = await this.invokeObjMW.dispatch(
        'mfd-whs-channel',
        'mwcc',
        args,
        username,
        org_name,
      );
      res.json({
        message: `${args[0]} packages are dispatched & Tx ID : ${txId}`,
      });
    } catch (err) {
      throw err;
    }
  }
}
