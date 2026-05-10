import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ComputedFieldProvider, CommonEntity, IEntityPreComputeFieldProvider, ComputedFieldMetadata } from '@solidxai/core';

import { EntityManager } from 'typeorm';


export interface PurchaseOrderNumberFieldContext {
  prefix: string;
  yearField?: string;
  padding?: number;
}

@ComputedFieldProvider()
@Injectable()
export class PurchaseOrderNumberFieldProvider<
  T extends CommonEntity,
> implements IEntityPreComputeFieldProvider<
  T,
  PurchaseOrderNumberFieldContext
> {

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  name(): string {
    return 'PurchaseOrderNumberFieldProvider';
  }

  help(): string {
    return `
      Generate custom purchase order numbers.

      Example:
      HME-A0001-2026
      PO-0001-2026
    `;
  }

  async preComputeValue(
    triggerEntity: T,
    computedFieldMetadata: ComputedFieldMetadata<PurchaseOrderNumberFieldContext>,
  ) {

    const {
      prefix,
      yearField = 'year',
      padding = 4,
    } = computedFieldMetadata.computedFieldValueProviderCtxt;

    const eventContext =
      computedFieldMetadata.eventContext;

    const entityName =
      eventContext?.metadataName ??
      eventContext?.databaseEntity?.constructor?.name;

    const fieldName =
      computedFieldMetadata.fieldName;

    // ================= YEAR =================
    const year =
      triggerEntity?.[yearField] ||
      new Date().getFullYear();

    // ================= FIND LAST RECORD =================
    const latestRecord =
      await this.entityManager.findOne(
        entityName as any,
        {
          where: {},
          order: {
            id: 'DESC',
          },
        },
      );

    let nextNumber = 1;

    // ================= EXTRACT LAST NUMBER =================
    if (
      latestRecord &&
      latestRecord[fieldName]
    ) {

      const regex =
        new RegExp(`${prefix}(\\d+)`);

      const match =
        latestRecord[fieldName].match(regex);

      if (match?.[1]) {

        nextNumber =
          Number(match[1]) + 1;
      }
    }

    // ================= PADDING =================
    const paddedNumber =
      String(nextNumber).padStart(
        padding,
        '0',
      );

    // ================= FINAL VALUE =================
    const generatedValue =
      `${prefix}${paddedNumber}-${year}`;

    triggerEntity[fieldName] =
      generatedValue;
  }
}