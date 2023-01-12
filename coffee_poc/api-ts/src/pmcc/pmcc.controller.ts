import { Body, Controller, Get, Post, Req, Response } from '@nestjs/common';
import { PmccService } from './pmcc.service';
import {OrderDto } from './dto/order.dto';

@Controller()
export class PmccController {
    constructor(private invokeObj:PmccService){}

    @Get("/producer/storage")
    async getProducerStorage(@Response() res){
        try {
          let message = await this.invokeObj.evaluateTx(
            "mfd-prd-channel",
            "pmcc",
            "availableStock",
            "user101",
            "tata"
          );
          res.json({ message: `Storage Of Producer = ${message}` });
        } catch (err) {
          throw err;
        }
      }
      
      @Get("/manufacturer-stock")
      async getManufacturerStock(@Response() res){
        try {
          let message = await this.invokeObj.evaluateTx(
            "mfd-prd-channel",
            "pmcc",
            "getManufacturerStock",
            "user101",
            "tata"
          );
          console.log(message);
          res.json({ message: `Manufacturer Stock = ${message}` });
        } catch (err) {
          throw err;
        }
      }
      
      @Get("/manufacturer-fund")
      async getManufacturerFunds(@Response() res) {
        try {
          let message = await this.invokeObj.evaluateTx(
            "mfd-prd-channel",
            "pmcc",
            "getManufacturerFunds",
            "user101",
            "tata"
          );
          res.json({ message: `Manufacturer Funds = ${message}` });
        } catch (err) {
          throw err;
        }
      }
      
      @Get("/manufacturer/order-details/:orderNumber")
      async getOrderDetails(@Req() req, @Response() res){
        try {
          let orderNumber = req.params.orderNumber;
          console.log(typeof orderNumber);
          let message = await this.invokeObj.getOrderDetails(
            "mfd-prd-channel",
            "pmcc",
            "getOrderDetails",
            orderNumber,
            "user101",
            "tata"
          );
          res.json({ message: `Order Details For Manufacturer = ${message}` });
        } catch (err) {
          throw err;
        }
      }
      
      @Get("/init-pmcc")
      async initPmcc(@Req() req, @Response() res){
        try {
         let txId = await this.invokeObj.evaluateTx(
            "mfd-prd-channel",
            "pmcc",
            "init",
            "user101",
            "tata"
          );
          res.json({ message: `Chaincode pmcc initialized with Transaction ID: ${txId}` });
        } catch (err) {
          throw err;
        }
      }
      
      @Post("/manufacture/place-order")
      async placeOrder(@Req() req, @Body() order : OrderDto, @Response() res) {
        try {
          let args:Array<string> = [];
          args.push(order.quantity);
          args.push(order.city);
          args.push(order.state);
          console.log(args);
          let result = await this.invokeObj.placeOrder(
            "mfd-prd-channel",
            "pmcc",
            "placeOrder",
            args,
            "user101",
            "tata"
          );
          res.json({ message: `Order Number & Transaction ID for Manufacturer =  ${result}` });
        } catch (err) {
          throw err;
        }
      }
      
      @Post("/production/transit/:orderNumber")
      async updateStatusToInTransit(@Req() req, @Response() res){
        try {
          let orderNo = req.params.orderNumber;
          let result = await this.invokeObj.orderInTransit(
            "mfd-prd-channel",
            "pmcc",
            "updateStatusToInTransit",
            orderNo,
            "user101",
            "tata"
          );
          res.json({ message: `Order Status Changed To In-Transit & Tx Id = ${result}` });
        } catch (err) {
          throw err;
        }
      }
      
      @Post("/production/delivered/:orderNumber")
      async updateStatusToDelivered(@Req() req, @Response() res) {
        try {
          let orderNo = req.params.orderNumber;
          let result = await this.invokeObj.orderInTransit(
            "mfd-prd-channel",
            "pmcc",
            "updateStatusToDelivered",
            orderNo,
            "user101",
            "tata"
          );
          res.json({ message: `Order Status Changed To Delivered & Tx ID : ${result}` });
        } catch (err) {
          throw err;
        }
      }
      
}
