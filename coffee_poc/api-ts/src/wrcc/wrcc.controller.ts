import { Controller, Get, Response, Req, Body, Post } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { WrccService } from './wrcc.service';

@Controller()
export class WrccController {
  constructor(private wr: WrccService) {}

  @Get('/init-wrcc')
  async initialize(@Response() res) {
    try {
      let txId = await this.wr.evaluateTx(
        'whs-rtlr-channel',
        'wrcc',
        'initialize',
        'user202',
        'bigbazar',
      );
      res.json({
        message: `Chaincode wrcc initialized & Transaction ID : ${txId}`,
      });
    } catch (err) {
      throw err;
    }
  }

  @Get('/warehouse/stock')
  async returnWarehouseSTockAccordingTomwCC(@Response() res) {
    try {
      let wStock = await this.wr.evaluateTx(
        'whs-rtlr-channel',
        'wrcc',
        'returnWarehouseSTockAccordingTomwCC',
        'user404',
        'tatastore',
      );
      res.json(wStock);
    } catch (err) {
      throw err;
    }
  }

  @Get('/warehouse/balance')
  async getWareHouseBalance(@Response() res) {
    try {
      let wBal = await this.wr.evaluateTx(
        'whs-rtlr-channel',
        'wrcc',
        'getWareHouseBalance',
        'user202',
        'bigbazar',
      );
      res.json(wBal);
    } catch (err) {
      throw err;
    }
  }

  @Get('/retailer/balance')
  async getRetailerBalance(@Response() res) {
    try {
      let bal = await this.wr.evaluateTx(
        'whs-rtlr-channel',
        'wrcc',
        'getRetailerBalance',
        'user202',
        'bigbazar',
      );
      res.json({ message: `Retailer Balance = ${bal}` });
    } catch (err) {
      throw err;
    }
  }

  @Get('/retailer/stock')
  async getRetailerStock(@Response() res) {
    try {
      let bal = await this.wr.evaluateTx(
        'whs-rtlr-channel',
        'wrcc',
        'getRetailerStock',
        'user202',
        'bigbazar',
      );
      res.json({ message: `Retailer Stock = ${bal}` });
    } catch (err) {
      throw err;
    }
  }

  @Post('/warehouse/order-transit/:orderNumber')
  async updateStatusToInTransit(@Response() res, @Req() req) {
    try {
      let orderNo = req.params.orderNumber;
      let txId = await this.wr.orderInTransit(
        'whs-rtlr-channel',
        'wrcc',
        'updateStatusToInTransit',
        orderNo,
        'user202',
        'bigbazar',
      );
      res.json({
        message: `Retailer Order Status Changed To In-Transit & Tx ID : ${txId}`,
      });
    } catch (err) {
      throw err;
    }
  }

  @Post('/retailer/place-order')
  async placeOrder(@Body() body: OrderDto, @Response() res) {
    try {
      let args = [];
      args.push(body.quantity);
      args.push(body.country);
      args.push(body.state);
      console.log(args);
      let result = await this.wr.placeOrder(
        'whs-rtlr-channel',
        'wrcc',
        'placeOrder',
        args,
        'user202',
        'bigbazar',
      );
      console.log(result);
      res.json({
        message: `Order Number for Reatailer =  ${result.result.orderNumber} & Tx ID : ${result.txId}`,
      });
    } catch (err) {
      throw err;
    }
  }

  @Post('/warehouse/order-delivered/:orderNumber')
  async updateStatusToDelivered(@Response() res, @Req() req) {
    try {
      let orderNo = req.params.orderNumber;
      let status = await this.wr.orderDelivered(
        'whs-rtlr-channel',
        'wrcc',
        'updateStatusToDelivered',
        orderNo,
        'user202',
        'bigbazar',
      );
      res.json({ message: 'Retailer Order Status Changed To Delivered' });
    } catch (err) {
      throw err;
    }
  }

  @Get('/warehouse/order-details/:orderNumber')
  async getOrderDetails(@Response() res, @Req() req) {
    try {
      let orderNo = req.params.orderNumber;
      let orderObj = await this.wr.getOrderDetails(
        'whs-rtlr-channel',
        'wrcc',
        'getOrderDetails',
        orderNo,
        'user202',
        'bigbazar',
      );
      res.json({ message: orderObj });
    } catch (err) {
      throw err;
    }
  }
}
