import { Controller, Post, Body, Param, UploadedFiles, UseInterceptors, Put, Get, Query, Delete, Patch, Res } from '@nestjs/common';
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { CreatePurchaseOrderDto } from '../dtos/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from '../dtos/update-purchase-order.dto';

import { Response } from 'express';

enum ShowSoftDeleted {
  INCLUSIVE = "inclusive",
  EXCLUSIVE = "exclusive",
}

@ApiTags('Labour Management System')
@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly service: PurchaseOrderService) { }


@ApiBearerAuth("jwt")
@Get('/generate-purchase-order')
async generatePurchaseOrder(
  @Query('poNo') poNo: string,
  @Query('id') id: number,
  @Res() res: Response,
) {
  const buffer = await this.service.generatePurchaseOrder( poNo, Number(id), );
  res.setHeader( 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', );
  res.setHeader( 'Content-Disposition', `attachment; filename=${poNo}.xlsx`, );
  return res.end(buffer);
}


  @ApiBearerAuth("jwt")
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  create(@Body() createDto: CreatePurchaseOrderDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    return this.service.create(createDto, files);
  }

  @ApiBearerAuth("jwt")
  @Post('/bulk')
  @UseInterceptors(AnyFilesInterceptor())
  insertMany(@Body() createDtos: CreatePurchaseOrderDto[], @UploadedFiles() filesArray: Express.Multer.File[][] = []) {
    return this.service.insertMany(createDtos, filesArray);
  }


  @ApiBearerAuth("jwt")
  @Put(':id')
  @UseInterceptors(AnyFilesInterceptor())
  update(@Param('id') id: number, @Body() updateDto: UpdatePurchaseOrderDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    return this.service.update(id, updateDto, files);
  }

  @ApiBearerAuth("jwt")
  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  partialUpdate(@Param('id') id: number, @Body() updateDto: UpdatePurchaseOrderDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    return this.service.update(id, updateDto, files, true);
  }

  @ApiBearerAuth("jwt")
  @Post('/bulk-recover')
  async recoverMany(@Body() ids: number[]) {
    return this.service.recoverMany(ids);
  }

  @ApiBearerAuth("jwt")
  @Get('/recover/:id')
  async recover(@Param('id') id: number) {
    return this.service.recover(id);
  }

  @ApiBearerAuth("jwt")
  @ApiQuery({ name: 'showSoftDeleted', required: false, enum: ShowSoftDeleted })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'fields', required: false, type: Array })
  @ApiQuery({ name: 'sort', required: false, type: Array })
  @ApiQuery({ name: 'groupBy', required: false, type: Array })
  @ApiQuery({ name: 'populate', required: false, type: Array })
  @ApiQuery({ name: 'populateMedia', required: false, type: Array })
  @ApiQuery({ name: 'filters', required: false, type: Array })
  @Get()
  async findMany(@Query() query: any) {
    return this.service.find(query);
  }

  @ApiBearerAuth("jwt")
  @Get(':id')
  async findOne(@Param('id') id: string, @Query() query: any) {
    return this.service.findOne(+id, query);
  }

  @ApiBearerAuth("jwt")
  @Delete('/bulk')
  async deleteMany(@Body() ids: number[]) {
    return this.service.deleteMany(ids);
  }

  @ApiBearerAuth("jwt")
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.service.delete(id);
  }



}
