import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef } from "@nestjs/core";
import { EntityManager } from 'typeorm';
import { CRUDService } from '@solidxai/core';
import * as ExcelJS from 'exceljs';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { PurchaseOrderRepository } from '../repositories/purchase-order.repository';
import { PoConfig } from '../entities/po-config.entity';
import { PurchaseOrderItems } from '../entities/purchase-order-items.entity';
import { PoConfigRepository } from '../repositories/po-config.repository';

@Injectable()
export class PurchaseOrderService extends CRUDService<PurchaseOrder> {
  private readonly logger = new Logger(PurchaseOrderService.name);

  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: PurchaseOrderRepository,
    readonly moduleRef: ModuleRef,
    private readonly poConfigRepo: PoConfigRepository

  ) {
    super(entityManager, repo, 'purchaseOrder', 'labour-management-system', moduleRef);
  }

  async generatePurchaseOrder(poNo: string, id: number) {
    this.logger.log(`Generating PO: ${poNo}, ID: ${id}`);

    try {
      const purchaseOrder = await this.repo.findOne({
        where: {
          id: id,
          poNo: poNo,
        },
        relations: ['poItems', 'site'],
      });

      if (!purchaseOrder) {
        this.logger.error(`Purchase Order not found: ${poNo}`);
        throw new Error('Purchase Order not found');
      }

      const poConfig = await this.poConfigRepo.findOne({
        where: { id: 1 },
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Purchase Order');

      this.addHeaderSection(worksheet, poConfig);
      this.addSupplierSection(worksheet, purchaseOrder);
      this.addItemsTable(worksheet, purchaseOrder.poItems);
      this.addTotalsSection(worksheet);
      this.addTermsSection(worksheet);

      const buffer = await workbook.xlsx.writeBuffer();
      this.logger.log(`PO generated successfully: ${poNo}`);

      return buffer;
    } catch (error) {
      this.logger.error(`Error generating purchase order: ${error.message}`, error.stack);
      throw error;
    }
  }

  private addHeaderSection(worksheet: ExcelJS.Worksheet, poConfig: PoConfig) {
    const titleRow = worksheet.addRow([]);
    titleRow.height = 30;
    worksheet.mergeCells('A1:H1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'PURCHASE ORDER';
    titleCell.font = {
      name: 'Arial',
      size: 16,
      bold: true,
    };
    titleCell.alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };

    worksheet.addRow([]);

    const companyRow = worksheet.addRow([poConfig?.compnayName || 'HM Electricals']);
    companyRow.getCell(1).font = { bold: true, size: 11 };

    if (poConfig?.iso) {
      worksheet.addRow([poConfig.iso]);
    }

    if (poConfig?.address) {
      worksheet.addRow([poConfig.address]);
    }

    const contactRow = worksheet.addRow([`Phone: ${poConfig?.telePhone || ''} Email: ${poConfig?.email || ''}`]);

    if (poConfig?.gst) {
      worksheet.addRow([`GSTIN: ${poConfig.gst}`]);
    }

    worksheet.addRow([]);

    worksheet.getColumn('A').width = 12;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 18;
    worksheet.getColumn('D').width = 15;
    worksheet.getColumn('E').width = 12;
    worksheet.getColumn('F').width = 15;
    worksheet.getColumn('G').width = 15;
    worksheet.getColumn('H').width = 15;
  }

  private addSupplierSection(worksheet: ExcelJS.Worksheet, purchaseOrder: PurchaseOrder) {
    const supplierRow = worksheet.addRow(['Supplier Name:', 'Ship To:']);
    supplierRow.getCell(1).font = { bold: true, size: 10 };
    supplierRow.getCell(3).font = { bold: true, size: 10 };

    worksheet.mergeCells(`A${worksheet.lastRow.number}:B${worksheet.lastRow.number}`);
    worksheet.mergeCells(`C${worksheet.lastRow.number}:H${worksheet.lastRow.number}`);

    const supplierDataRow = worksheet.addRow([purchaseOrder.supplierName || '', '', purchaseOrder.shipTo || '']);
    worksheet.mergeCells(`A${worksheet.lastRow.number}:B${worksheet.lastRow.number}`);
    worksheet.mergeCells(`C${worksheet.lastRow.number}:H${worksheet.lastRow.number}`);

    supplierDataRow.height = 30;
    for (let i = 1; i <= 8; i++) {
      supplierDataRow.getCell(i).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }

    const poDetailsRow = worksheet.addRow(['', '', 'PO NO:', '', '', '', '', 'PO Date:']);
    poDetailsRow.getCell(3).font = { bold: true, size: 10 };
    poDetailsRow.getCell(8).font = { bold: true, size: 10 };

    const poDetailsDataRow = worksheet.addRow(['', '', purchaseOrder.poNo || '', '', '', '', '', purchaseOrder.poDate?.toString() || '']);
    poDetailsDataRow.getCell(3).value = purchaseOrder.poNo || '';
    poDetailsDataRow.getCell(8).value = purchaseOrder.poDate ? new Date(purchaseOrder.poDate).toLocaleDateString() : '';

    const reqDateRow = worksheet.addRow(['', '', 'Req Date:', '', '', '', '', purchaseOrder.reqDate?.toString() || '']);
    reqDateRow.getCell(3).font = { bold: true, size: 10 };
    const reqDateDataRow = worksheet.addRow(['', '', '', '', '', '', '', purchaseOrder.reqDate ? new Date(purchaseOrder.reqDate).toLocaleDateString() : '']);
    reqDateDataRow.getCell(8).value = purchaseOrder.reqDate ? new Date(purchaseOrder.reqDate).toLocaleDateString() : '';

    worksheet.addRow([]);
  }

  private addItemsTable(worksheet: ExcelJS.Worksheet, items: PurchaseOrderItems[]) {
    const headerRow = worksheet.addRow(['Sr', 'Description', 'HSN', 'Quantity', 'Unit', 'Rate (₹)', 'Amount (₹)']);
    headerRow.font = { bold: true, size: 10 };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 20;

    for (let i = 1; i <= 7; i++) {
      headerRow.getCell(i).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' },
      };
      headerRow.getCell(i).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }

    let srNo = 1;
    items.forEach((item) => {
      const row = worksheet.addRow([
        srNo,
        item.description || '',
        item.hsnCode || '',
        item.prdouctQuantity || '',
        '',
        '',
        '',
      ]);

      row.height = 25;
      row.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

      for (let i = 1; i <= 7; i++) {
        row.getCell(i).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }

      row.getCell(1).alignment = { horizontal: 'center' };
      row.getCell(4).alignment = { horizontal: 'center' };

      srNo++;
    });

    for (let i = srNo; i <= srNo + 5; i++) {
      const emptyRow = worksheet.addRow(['', '', '', '', '', '', '']);
      emptyRow.height = 25;
      for (let j = 1; j <= 7; j++) {
        emptyRow.getCell(j).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    }
  }

  private addTotalsSection(worksheet: ExcelJS.Worksheet) {
    worksheet.addRow([]);

    const netTotalRow = worksheet.addRow(['', '', '', '', 'Net Total', '', '']);
    netTotalRow.getCell(5).font = { bold: true };
    netTotalRow.getCell(5).alignment = { horizontal: 'right' };
    for (let i = 5; i <= 7; i++) {
      netTotalRow.getCell(i).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }

    const cgstRow = worksheet.addRow(['', '', '', '', 'Input CGST', '', '']);
    cgstRow.getCell(5).font = { bold: true };
    cgstRow.getCell(5).alignment = { horizontal: 'right' };
    for (let i = 5; i <= 7; i++) {
      cgstRow.getCell(i).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }

    const sgstRow = worksheet.addRow(['', '', '', '', 'Input SGST', '', '']);
    sgstRow.getCell(5).font = { bold: true };
    sgstRow.getCell(5).alignment = { horizontal: 'right' };
    for (let i = 5; i <= 7; i++) {
      sgstRow.getCell(i).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }

    const roundingRow = worksheet.addRow(['', '', '', '', 'Rounding Adjustment', '', '']);
    roundingRow.getCell(5).font = { bold: true };
    roundingRow.getCell(5).alignment = { horizontal: 'right' };
    for (let i = 5; i <= 7; i++) {
      roundingRow.getCell(i).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }

    const grandTotalRow = worksheet.addRow(['', '', '', '', 'Grand Total', '', '']);
    grandTotalRow.getCell(5).font = { bold: true, size: 12 };
    grandTotalRow.getCell(5).alignment = { horizontal: 'right' };
    grandTotalRow.getCell(6).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF00' },
    };
    grandTotalRow.getCell(7).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF00' },
    };
    for (let i = 5; i <= 7; i++) {
      grandTotalRow.getCell(i).border = {
        top: { style: 'medium' },
        left: { style: 'thin' },
        bottom: { style: 'medium' },
        right: { style: 'thin' },
      };
    }

    const inWordsRow = worksheet.addRow(['', '', '', '', 'In Words:', '', '']);
    inWordsRow.getCell(5).font = { bold: true };
    inWordsRow.getCell(5).alignment = { horizontal: 'right' };
    inWordsRow.getCell(7).alignment = { horizontal: 'left', wrapText: true };
    for (let i = 5; i <= 7; i++) {
      inWordsRow.getCell(i).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }
  }

  private addTermsSection(worksheet: ExcelJS.Worksheet) {
    worksheet.addRow([]);

    const termsHeaderRow = worksheet.addRow(['Sub-Contract Terms & Conditions:']);
    termsHeaderRow.getCell(1).font = { bold: true, size: 10 };

    for (let i = 0; i < 5; i++) {
      worksheet.addRow(['']);
    }
  }
}