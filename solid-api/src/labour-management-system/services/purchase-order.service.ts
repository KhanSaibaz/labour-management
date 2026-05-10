import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef } from '@nestjs/core';
import { EntityManager } from 'typeorm';
import { CRUDService } from '@solidxai/core';
import * as ExcelJS from 'exceljs';
import * as path from 'path';

import { PurchaseOrder } from '../entities/purchase-order.entity';
import { PurchaseOrderRepository } from '../repositories/purchase-order.repository';
import { PoConfigRepository } from '../repositories/po-config.repository';

// ─────────────────────────────────────────────────────────────────────────────
//  Convenience type aliases
// ─────────────────────────────────────────────────────────────────────────────
type WS = ExcelJS.Worksheet;
type Cell = ExcelJS.Cell;

@Injectable()
export class PurchaseOrderService extends CRUDService<PurchaseOrder> {

  private readonly logger = new Logger(PurchaseOrderService.name);

  constructor(
    @InjectEntityManager('default')
    readonly entityManager: EntityManager,
    readonly repo: PurchaseOrderRepository,
    readonly moduleRef: ModuleRef,
    private readonly poConfigRepo: PoConfigRepository,
  ) {
    super(
      entityManager,
      repo,
      'purchaseOrder',
      'labour-management-system',
      moduleRef,
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  PUBLIC  ➜  generatePurchaseOrder
  // ═══════════════════════════════════════════════════════════════════════════

  async generatePurchaseOrder(poNo: string, id: number): Promise<Buffer> {

    try {

      // ── 1. Fetch data ──────────────────────────────────────────────────────

      const purchaseOrder = await this.repo.findOne({
        where: { id, poNo },
        relations: ['poItems', 'site'],
      });

      if (!purchaseOrder) throw new Error('Purchase Order not found');

      const poConfig = await this.poConfigRepo.findOne({ where: { id: 1 } });

      // ── 2. Workbook & worksheet ────────────────────────────────────────────

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Purchase Order');

      // ── 3. Page setup — single A4 page ────────────────────────────────────

      worksheet.pageSetup = {
        paperSize: 9,          // A4
        orientation: 'portrait',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 1,
        margins: {
          left: 0.25,
          right: 0.25,
          top: 0.40,
          bottom: 0.40,
          header: 0.20,
          footer: 0.20,
        },
      };

      worksheet.properties.defaultRowHeight = 18;

      // ── 4. Column widths ───────────────────────────────────────────────────

      worksheet.columns = [
        { width: 5 },   // A  — Sr
        { width: 36 },   // B  — Description
        { width: 10 },   // C  — HSN
        { width: 11 },   // D  — Quantity
        { width: 13 },   // E  — List Price
        { width: 11 },   // F  — Discount
        { width: 13 },   // G  — Rate
        { width: 15 },   // H  — Amount
      ];

      // ══════════════════════════════════════════════════════════════════════
      //  ROW 1 — TITLE
      // ══════════════════════════════════════════════════════════════════════

      worksheet.mergeCells('A1:H1');
      this.styleCell(worksheet.getCell('A1'), {
        value: 'Purchase Order',
        font: { name: 'Arial', size: 18, bold: false },
        alignment: { horizontal: 'center', vertical: 'middle' },
      });
      worksheet.getRow(1).height = 30;

      // ══════════════════════════════════════════════════════════════════════
      //  ROWS 3–8 — COMPANY DETAILS  +  LOGO
      // ══════════════════════════════════════════════════════════════════════
      // ── Logo ──────────────────────────────────────────────────────────────────
      const logoId = workbook.addImage({
        filename: path.join(__dirname, 'logo.jpeg'),
        extension: 'jpeg',
      });

      worksheet.addImage(logoId, {
        tl: { col: 6.1, row: 2.8 },
        ext: { width: 150, height: 90 },
      });

      // ── Company rich-text block (A3:E8) ───────────────────────────────────────
      worksheet.mergeCells('A3:E8');
      worksheet.getCell('A3').value = {
        richText: [
          {
            text: `${poConfig?.compnayName ?? ''}\n`,
            font: { name: 'Arial', bold: true, size: 10 },
          },
          {
            text: `${poConfig?.iso ?? ''}\n`,
            font: { name: 'Arial', bold: true, size: 9 },
          },
          {
            text:
              `${poConfig?.address ?? ''}\n` +
              `Tel.: ${poConfig?.telePhone ?? ''}\n` +
              `Email: ${poConfig?.email ?? ''}  Web: ${poConfig?.webSite ?? ''}\n` +
              `GST:${poConfig?.gst ?? ''} | PAN:${poConfig?.pan ?? ''}\n` +
              `CIN:${poConfig?.cin ?? ''} | MSME:${poConfig?.msme ?? ''}`,
            font: { name: 'Arial', bold: false, size: 9 },
          },
        ],
      };
      worksheet.getCell('A3').alignment = { wrapText: true, vertical: 'top' };
      this.applyBorderRange(worksheet, 'A3:E8');

      // ── Logo region (F3:H8) — merge into ONE cell so no internal grid lines ───
      worksheet.mergeCells('F3:H8');
      worksheet.getCell('F3').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      worksheet.getRow(3).height = 20;

      // ══════════════════════════════════════════════════════════════════════
      //  ROWS 9–13 — SUPPLIER  |  SHIP TO  |  PO DETAILS
      // ══════════════════════════════════════════════════════════════════════

      worksheet.mergeCells('A9:C12');
      worksheet.mergeCells('D9:F12');
      worksheet.mergeCells('G9:H12');

      // Supplier block
      worksheet.getCell('A9').value = {
        richText: [
          {
            text: `Supplier Name: ${purchaseOrder.supplierName ?? ''}\n`,
            font: { name: 'Arial', bold: true, size: 9 },
          },

        ],
      };
      worksheet.getCell('A9').alignment = { wrapText: true, vertical: 'top' };

      // Ship To block
      worksheet.getCell('D9').value = {
        richText: [
          {
            text: `Ship To: ${purchaseOrder.shipTo ?? ''}\n`,
            font: { name: 'Arial', bold: true, size: 9 },
          },

        ],
      };
      worksheet.getCell('D9').alignment = { wrapText: true, vertical: 'top' };

      // PO meta block
      worksheet.getCell('G9').value = {
        richText: [
          {
            text: `PO No :  ${purchaseOrder.poNo ?? ''}\n\n`,
            font: { name: 'Arial', bold: true, size: 9 },
          },
          {
            text: `PO Date :  ${this.fmtDate(purchaseOrder.poDate)}\n\n`,
            font: { name: 'Arial', bold: true, size: 9 },
          },
          {
            text: `Req Date :  ${this.fmtDate(purchaseOrder.reqDate)}`,
            font: { name: 'Arial', bold: true, size: 9 },
          },
        ],
      };
      worksheet.getCell('G9').alignment = { wrapText: true, vertical: 'top' };

      this.applyBorderRange(worksheet, 'A9:C12');
      this.applyBorderRange(worksheet, 'D9:F12');
      this.applyBorderRange(worksheet, 'G9:H12');

      // ══════════════════════════════════════════════════════════════════════
      //  ROW 15 — TABLE HEADER
      // ══════════════════════════════════════════════════════════════════════

      const TABLE_HEADERS = [
        'Sr',
        'Description',
        'HSN',
        'Quantity',
        'List\nPrice(₹)',
        'Discount',
        'Rate(₹)',
        'Amount(₹)',
      ];

      const headerRow = worksheet.getRow(15);
      headerRow.height = 28;

      TABLE_HEADERS.forEach((label, i) => {
        const cell = headerRow.getCell(i + 1);
        cell.value = label;
        cell.font = { name: 'Arial', bold: true, size: 9 };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD9D9D9' },
        };
        this.applyBorder(cell);
      });

      // ══════════════════════════════════════════════════════════════════════
      //  ROWS 16+ — ITEM ROWS
      //  ✅ Pre-fill : Sr, Description, HSN, Quantity
      //  ⬜ Leave EMPTY : List Price, Discount, Rate, Amount (user fills manually)
      // ══════════════════════════════════════════════════════════════════════

      let currentRow = 16;

      purchaseOrder.poItems.forEach((item, index) => {

        const row = worksheet.getRow(currentRow);
        row.height = 32;

        // Col A — Sr
        this.styleCell(row.getCell(1), {
          value: index + 1,
          font: { name: 'Arial', size: 9 },
          alignment: { horizontal: 'center', vertical: 'middle' },
        });

        // Col B — Description
        this.styleCell(row.getCell(2), {
          value: item.description ?? '',
          font: { name: 'Arial', size: 9 },
          alignment: { horizontal: 'left', vertical: 'middle', wrapText: true },
        });

        // Col C — HSN
        this.styleCell(row.getCell(3), {
          value: item.hsnCode ?? '',
          font: { name: 'Arial', size: 9 },
          alignment: { horizontal: 'center', vertical: 'middle' },
        });

        // Col D — Quantity
        this.styleCell(row.getCell(4), {
          value: item.prdouctQuantity
            ? `${item.prdouctQuantity} Nos`
            : '',
          font: { name: 'Arial', size: 9 },
          alignment: { horizontal: 'center', vertical: 'middle' },
        });

        // Cols E–H — INTENTIONALLY LEFT EMPTY (user fills after download)
        //            Only set numFmt + border so Excel formats correctly on entry
        const emptyColFormats: Record<number, string> = {
          5: '#,##0.00',       // List Price
          6: '0.00"%"',        // Discount
          7: '#,##0.00',       // Rate
          8: '#,##0.00',       // Amount
        };

        Object.entries(emptyColFormats).forEach(([colStr, fmt]) => {
          const col = Number(colStr);
          const cell = row.getCell(col);
          cell.value = '';
          cell.font = { name: 'Arial', size: 9 };
          cell.numFmt = fmt;
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
          this.applyBorder(cell);
        });

        // Borders on pre-filled cols
        [1, 2, 3, 4].forEach((c) => this.applyBorder(row.getCell(c)));

        currentRow++;
      });

      // ══════════════════════════════════════════════════════════════════════
      //  5 EXTRA EMPTY ROWS — bordered placeholder rows
      // ══════════════════════════════════════════════════════════════════════

      for (let i = 0; i < 5; i++) {
        const row = worksheet.getRow(currentRow);
        row.height = 22;

        for (let col = 1; col <= 8; col++) {
          const cell = row.getCell(col);
          cell.value = '';
          cell.font = { name: 'Arial', size: 9 };
          this.applyBorder(cell);
        }

        currentRow++;
      }

      // ══════════════════════════════════════════════════════════════════════
      //  TOTALS SECTION
      //  ✅ Labels pre-filled
      //  ⬜ Amount column EMPTY — user fills manually after download
      // ══════════════════════════════════════════════════════════════════════

      const TOTAL_LABELS: { label: string; isGrand: boolean }[] = [
        { label: 'Net Total', isGrand: false },
        { label: 'Input CGST', isGrand: false },
        { label: 'Input SGST', isGrand: false },
        { label: 'Rounding Adjustment', isGrand: false },
        { label: 'Grand Total', isGrand: true },
      ];

      const yellowFill: ExcelJS.Fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
      };

      TOTAL_LABELS.forEach(({ label, isGrand }) => {

        worksheet.mergeCells(`E${currentRow}:G${currentRow}`);

        const labelCell = worksheet.getCell(`E${currentRow}`);
        const amountCell = worksheet.getCell(`H${currentRow}`);

        // Label
        this.styleCell(labelCell, {
          value: label,
          font: { name: 'Arial', bold: isGrand, size: isGrand ? 11 : 9 },
          alignment: { horizontal: 'right', vertical: 'middle' },
          fill: isGrand ? yellowFill : undefined,
        });

        // Amount — EMPTY for manual entry
        this.styleCell(amountCell, {
          value: '',
          font: { name: 'Arial', bold: isGrand, size: isGrand ? 11 : 9 },
          alignment: { horizontal: 'right', vertical: 'middle' },
          fill: isGrand ? yellowFill : undefined,
        });
        amountCell.numFmt = '₹\\ #,##0.00';

        this.applyBorderRange(worksheet, `E${currentRow}:H${currentRow}`);
        worksheet.getRow(currentRow).height = isGrand ? 24 : 18;

        currentRow++;
      });

      // ══════════════════════════════════════════════════════════════════════
      //  IN WORDS ROW
      //  ✅ "In Words" label pre-filled
      //  ⬜ Content cell EMPTY — user writes after download
      // ══════════════════════════════════════════════════════════════════════

      worksheet.mergeCells(`F${currentRow}:H${currentRow}`);

      this.styleCell(worksheet.getCell(`E${currentRow}`), {
        value: 'In Words',
        font: { name: 'Arial', size: 9 },
        alignment: { horizontal: 'right', vertical: 'middle' },
      });

      this.styleCell(worksheet.getCell(`F${currentRow}`), {
        value: '',
        font: { name: 'Arial', size: 9 },
        alignment: { horizontal: 'right', vertical: 'middle', wrapText: true },
      });

      this.applyBorderRange(worksheet, `E${currentRow}:H${currentRow}`);
      worksheet.getRow(currentRow).height = 28;

      currentRow += 2;

      // ══════════════════════════════════════════════════════════════════════
      //  BOTTOM — SUB-CONTRACT TERMS & CONDITIONS
      // ══════════════════════════════════════════════════════════════════════

      this.styleCell(worksheet.getCell(`A${currentRow}`), {
        value: 'Sub-Contract Terms & Conditions:',
        font: { name: 'Arial', bold: true, size: 10 },
      });

      // ── Write & return buffer ──────────────────────────────────────────────

      const buffer = await workbook.xlsx.writeBuffer();
      return buffer as unknown as Buffer;

    } catch (error: any) {
      this.logger.error(`generatePurchaseOrder failed: ${error?.message}`);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  PRIVATE HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Apply a uniform thin border on all four sides of a single cell.
   */
  private applyBorder(cell: Cell): void {
    const thin: ExcelJS.BorderStyle = 'thin';
    cell.border = {
      top: { style: thin },
      left: { style: thin },
      bottom: { style: thin },
      right: { style: thin },
    };
  }

  /**
   * Apply thin borders to every cell inside a rectangular range.
   * @param range  e.g. 'A1:H8'
   */
  private applyBorderRange(ws: WS, range: string): void {
    const [startRef, endRef] = range.split(':');
    const startCell = ws.getCell(startRef);
    const endCell = ws.getCell(endRef);

    const rowStart = Number(startCell.row);
    const rowEnd = Number(endCell.row);
    const colStart = Number(startCell.col);
    const colEnd = Number(endCell.col);

    for (let r = rowStart; r <= rowEnd; r++) {
      for (let c = colStart; c <= colEnd; c++) {
        this.applyBorder(ws.getCell(r, c));
      }
    }
  }

  /**
   * Set value, font, alignment, and optional fill on a cell in one call.
   */
  private styleCell(
    cell: Cell,
    opts: {
      value?: ExcelJS.CellValue;
      font?: Partial<ExcelJS.Font>;
      alignment?: Partial<ExcelJS.Alignment>;
      fill?: ExcelJS.Fill;
    },
  ): void {
    if (opts.value !== undefined) cell.value = opts.value;
    if (opts.font) cell.font = opts.font as ExcelJS.Font;
    if (opts.alignment) cell.alignment = opts.alignment as ExcelJS.Alignment;
    if (opts.fill) cell.fill = opts.fill;
  }

  /**
   * Format a Date / ISO string to DD/MM/YYYY (Indian locale).
   * Returns empty string for null / undefined values.
   */
  private fmtDate(value?: string | Date | null): string {
    if (!value) return '';
    return new Date(value).toLocaleDateString('en-GB');
  }

  /**
 * Apply a thin border only on the outer edges of a rectangular range.
 * Inner cells get NO borders — ideal for merged logo/image regions.
 *
 * @param ws     ExcelJS Worksheet
 * @param range  e.g. 'F3:H8'
 */
  private applyOuterBorder(ws: WS, range: string): void {
    const [startRef, endRef] = range.split(':');
    const startCell = ws.getCell(startRef);
    const endCell = ws.getCell(endRef);

    const rowStart = Number(startCell.row);
    const rowEnd = Number(endCell.row);
    const colStart = Number(startCell.col);
    const colEnd = Number(endCell.col);

    const thin: ExcelJS.BorderStyle = 'thin';

    for (let r = rowStart; r <= rowEnd; r++) {
      for (let c = colStart; c <= colEnd; c++) {
        const cell = ws.getCell(r, c);

        cell.border = {
          top: r === rowStart ? { style: thin } : {},
          bottom: r === rowEnd ? { style: thin } : {},
          left: c === colStart ? { style: thin } : {},
          right: c === colEnd ? { style: thin } : {},
        };
      }
    }
  }
}