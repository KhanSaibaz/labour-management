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


  async generatePurchaseOrder(poNo: string, id: number): Promise<Buffer> {

    try {


      const purchaseOrder = await this.repo.findOne({
        where: { id, poNo },
        relations: ['poItems', 'site'],
      });

      if (!purchaseOrder) throw new Error('Purchase Order not found');

      const poConfig = await this.poConfigRepo.findOne({ where: { id: 1 } });


      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Purchase Order');

      worksheet.views = [
        {
          showGridLines: false,
        },
      ];

      worksheet.pageSetup = {
        paperSize: 9,
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

      worksheet.columns = [
        { width: 5 },
        { width: 36 },   // B  — Description
        { width: 10 },   // C  — HSN
        { width: 12 },   // D  — Quantity
        { width: 14 },   // E  — List Price
        { width: 11 },   // F  — Discount
        { width: 13 },   // G  — Rate
        { width: 15 },   // H  — Amount
      ];

      //  ROW 1 — TITLE

      worksheet.mergeCells('A1:H1');
      this.styleCell(worksheet.getCell('A1'), {
        value: 'Purchase Order',
        font: { name: 'Arial', size: 18, bold: false },
        alignment: { horizontal: 'center', vertical: 'middle' },
      });

      worksheet.getCell('A1').border = {
        top: { style: undefined },
        left: { style: undefined },
        bottom: { style: undefined },
        right: { style: undefined },
      };
      worksheet.getRow(1).height = 30;

      // ─────────────────────────────────────── Company rich-text and logo ───────────────────────────────────────
      // LEFT COMPANY SECTION
      worksheet.mergeCells('A2:E6');

      worksheet.getCell('A2').value = {
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

      worksheet.getCell('A2').alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'left',
        indent: 1,

      };

      this.applyBorderRange(worksheet, 'A2:E6');


      // LOGO SECTION
      worksheet.mergeCells('F2:H6');

      worksheet.getCell('F2').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      const logoId = workbook.addImage({
        filename: path.join(__dirname, 'logo.jpeg'),
        extension: 'jpeg',
      });

      worksheet.addImage(logoId, {
        tl: { col: 6.2, row: 2.2 },
        ext: { width: 130, height: 70 },
      });


      for (let i = 2; i <= 6; i++) {
        worksheet.getRow(i).height = 18;
      }

      //  ROWS 9–12 — SUPPLIER | SHIP TO | PO DETAILS

      worksheet.mergeCells('A7:C9');
      worksheet.mergeCells('D7:F9');
      worksheet.mergeCells('G7:H9');


      worksheet.getCell('A9').value = {
        richText: [
          {
            text: `Supplier Name: `,
            font: { name: 'Arial', bold: false, size: 10 },
          },
          {
            text: `${purchaseOrder.supplierName ?? ''}\n`,
            font: { name: 'Arial', bold: true, size: 10 },
          },
        ],
      };

      worksheet.getCell('A9').alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'left',
        indent: 1,

      };


      // SHIP TO BLOCK
      worksheet.getCell('D9').value = {
        richText: [
          {
            text: `Ship To: `,
            font: { name: 'Arial', bold: false, size: 10 },
          },
          {
            text: `${purchaseOrder.shipTo ?? ''}\n`,
            font: { name: 'Arial', bold: true, size: 10 },
          },
        ],
      };

      worksheet.getCell('D9').alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'left',
        indent: 1,

      };


      // PO DETAILS BLOCK
      worksheet.getCell('G9').value = {
        richText: [
          {
            text: `PO No :  ${purchaseOrder.poNo ?? ''}\n\n`,
            font: { name: 'Arial', bold: true, size: 10 },
          },
          {
            text: `PO Date : ${this.fmtDate(purchaseOrder.poDate)}\n\n`,
            font: { name: 'Arial', bold: true, size: 10 },
          },
          {
            text: `Req Date : ${this.fmtDate(purchaseOrder.reqDate)}`,
            font: { name: 'Arial', bold: true, size: 10 },
          },
        ],
      };

      worksheet.getCell('G9').alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'left',
        indent: 1,

      };


      // SAME HEIGHT LIKE PDF
      for (let i = 7; i <= 9; i++) {
        worksheet.getRow(i).height = 30;
      }


      // BORDERS
      this.applyBorderRange(worksheet, 'A7:C9');
      this.applyBorderRange(worksheet, 'D7:F9');
      this.applyBorderRange(worksheet, 'G7:H9');

      //  =====================================  Tables  =======================
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

      const headerRow = worksheet.getRow(10);
      headerRow.height = 26;

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

      let currentRow = 11;

      purchaseOrder.poItems.forEach((item, index) => {

        const row = worksheet.getRow(currentRow);
        row.height = 26;

        // Col A — Sr
        this.styleCell(row.getCell(1), {
          value: index + 1,
          font: { name: 'Arial', size: 9 },
          alignment: { horizontal: 'center', vertical: 'middle' },
        });

        this.styleCell(row.getCell(2), {
          value: item.description ?? '',
          font: { name: 'Arial', size: 9, },
          alignment: { horizontal: 'left', vertical: 'middle', wrapText: true, indent: 1 },
        });

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
          alignment: { horizontal: 'right', vertical: 'middle', indent: 1 },
          fill: isGrand ? yellowFill : undefined,
        });

        this.styleCell(amountCell, {
          value: '',
          font: { name: 'Arial', bold: isGrand, size: isGrand ? 11 : 9 },
          alignment: { horizontal: 'right', vertical: 'middle' },
          fill: isGrand ? yellowFill : undefined,
        });
        amountCell.numFmt = '₹\\ #,##0.00';

        this.applyBorderRange(worksheet, `E${currentRow}:H${currentRow}`);
        worksheet.getRow(currentRow).height = isGrand ? 24 : 18;
        worksheet.mergeCells(`A${currentRow}:D${currentRow}`);

        currentRow++;
      });


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

      //  BOTTOM — SUB-CONTRACT TERMS & CONDITIONS
      const termsAndConditions = [
        {
          text: `1. Contractor has to take all the safety precautions with necessary tools & tackles. Provide all PPE’s Safety Helmet, Safety gloves, Safety goggles, Safety shoes, Safety Belt (full body harness), Welding apron, gloves, fire blanket, ear plugs, dust masks, flash back arrestor, trolley with lockable wheels etc. In the event of non-complying above company shall make available all PPE’s at site and cost towards providing such PPE’s shall be recovered from running bills.`,
          height: 50
        },

        {
          text: `2. No child labour is allowed at site.`,
          height: 20
        },

        {
          text: `3. Contractor will employ only workers with sound health and will get their medical tests done as per the client’s requirement at his cost.`,
          height: 20
        },

        {
          text: `4. No alcohol, smoking and splitting, use of gutka, paan, etc at site is allowed. Urinating or defecating at non designated place will not be tolerated and penalties will be imposed.`,
          height: 32
        },

        {
          text: `5. If any penalties are levied by the owners/ PMC / Safety for violation of any sort the same will be debited to the contractor.`,
          height: 20
        },

        {
          text: `6. Contractor must make his own arrangement for travelling and local transport, accommodation, food, power drinking water arrangement for his workmen, necessary tools to Cary out his work, necessary testing equipment (duly calibrated by safety /PMC)`,
          height: 32
        },

        {
          text: `7. Joint less cable to be used for all type of equipment’s. If joints are there it should be with weatherproof socket/ junction box arrangements. All sockets and tops used should be industrial type.`,
          height: 32
        },

        {
          text: `8. Power supply will be given at work location however its responsibility of users to take preventive measure to work safely at site.`,
          height: 20
        },

        {
          text: `9. We will provide ladders / scaffoldings which are approved by the client/ consultant/ PMC. Its responsibility of your team to maintain in good working conditions failure to which we reserve the right to recover cost in the event of any damages.`,
          height: 32
        },

        {
          text: `10. Contractor has to produce necessary documents towards registration of their employees with ESIC / PF authorities and proof of payments made should be submitted. All other statutory requirements should be fulfilled at his own risk and cost. If company is making such payments the same will be deducted from the interim bills.`,
          height: 47
        },

        {
          text: `11. Any rework due to quality shall be debited to contractor along with wasted material cost.`,
          height: 20
        },

        {
          text: `12. The contractor should pay minimum wages to his employees and record for the same should be submitted periodically.`,
          height: 20
        },

        {
          text: `13. The contractor should maintain attendance of his employees and should keep records of over time / advances and holidays given to his employees.`,
          height: 32
        },

        {
          text: `14. The unit rate agreed and offered is inclusive of all taxes and incidental expenses.`,
          height: 20
        },

        {
          text: `15. Contractor has to arrange necessary skilled / unskilled manpower at site to complete the project in stipulated time frame. Penalties will be levied if there is any delay, or the company reserve its right to employ additional contractors to complete the job / debit the cost involved to the contractor. No reason for deployment of additional contractor needs to be given to the contractor.`,
          height: 45
        },

        {
          text: `16. If the work is held up due to insufficient tools and tackles, material handling equipment’s, scaffolding, etc. the same may be provided by the company at the cost of the contractor to ensure that work is not suffering. This will be the sole decision of the company.`,
          height: 32
        },

        {
          text: `17. The contractor will strictly adhere to the standard operating procedure and work method statements and quality assurance plan. Any rework due to poor quality of work will not be paid and the cost of rework will be recovered from the final bill.`,
          height: 32
        },

        {
          text: `18. The contractor will submit monthly (before 25th of every month) bills along with measurement sheet properly certified by the project manager/ site in charge. No delayed bills will be accepted. Payments for the same will be made within 30 days of submission of the certified bills.`,
          height: 45
        },

        {
          text: `19. Contractor will strictly follow good housekeeping norms at workplace as well as stores. Any penalties or stoppage of work due to poor house keeping the contractor will be solely responsible for the same.`,
          height: 35
        },

        {
          text: `Payment Terms:
Immediate`,
          height: 35
        },

        {
          text: `Applicable Law:
It is intended that this Agreement be valid and enforceable under the laws of the state of Maharashtra, and that the laws of this state shall govern the agreement's interpretation.`,
          height: 45
        },

        {
          text: `Non-Disclosure:
Contractor / Associate will keep all trade secrets and/or proprietary information of the Company in strict confidence. A trade secret is any information, process or idea that is not generally known to persons outside the Company, which the Company considers confidential, and which gives the Company a competitive advantage.`,
          height: 50
        }
      ];


      // TITLE
      worksheet.mergeCells(`A${currentRow}:H${currentRow}`);

      this.styleCell(worksheet.getCell(`A${currentRow}`), {
        value: 'Sub-Contract Terms & Conditions:',
        font: {
          name: 'Arial',
          bold: true,
          size: 12,
        },
        alignment: {
          horizontal: 'left',
          vertical: 'middle',
          indent: 1
        },
      });

      worksheet.getCell(`A${currentRow}`).border = {};
      worksheet.getRow(currentRow).height = 24;

      currentRow += 1;


      // EACH POINT IN NEW CELL/ROW
      termsAndConditions.forEach((item) => {

        worksheet.mergeCells(`A${currentRow}:H${currentRow}`);

        const cell = worksheet.getCell(`A${currentRow}`);

        cell.value = item.text;

        cell.font = {
          name: 'Arial',
          size: 10,
        };

        cell.alignment = {
          wrapText: true,
          vertical: 'top',
          horizontal: 'left',
          indent: 1
        };

        cell.border = {};

        // DIFFERENT HEIGHT PER CELL
        worksheet.getRow(currentRow).height = item.height;

        currentRow += 1;
      });

      const buffer = await workbook.xlsx.writeBuffer();
      return buffer as unknown as Buffer;
    } catch (error: any) {
      this.logger.error(`generatePurchaseOrder failed: ${error?.message}`);
      throw error;
    }
  }


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


}