import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import {
  ComputedFieldProvider,
  CommonEntity,
  IEntityPreComputeFieldProvider,
  ComputedFieldMetadata,
} from '@solidxai/core';
import { EntityManager } from 'typeorm';

export interface LabourSequenceContext {
  sequenceName: string;
}

@ComputedFieldProvider()
@Injectable()
export class LabourSequenceProvider<T extends CommonEntity>
  implements IEntityPreComputeFieldProvider<T, LabourSequenceContext> {

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager
  ) {}

  name(): string {
    return 'LabourSequenceProvider';
  }

  help(): string {
    return 'Generate labour code like LB01, LB02, etc from ss_model_sequence';
  }

  async preComputeValue(
    triggerEntity: T,
    computedFieldMetadata: ComputedFieldMetadata<LabourSequenceContext>
  ): Promise<void> {

    let context = computedFieldMetadata.computedFieldValueProviderCtxt;

    // ✅ Parse context safely
    if (typeof context === 'string') {
      try {
        context = JSON.parse(context);
      } catch {
        throw new Error(`Invalid computedFieldValueProviderCtxt JSON: ${context}`);
      }
    }

    if (!context?.sequenceName) {
      throw new Error('sequenceName not provided in computed field context');
    }

    const { sequenceName } = context;
    const fieldName = computedFieldMetadata.fieldName;

    await this.entityManager.transaction(async (manager) => {

      // 🔒 Lock row for concurrency safety
      const seqResult = await manager.query(
        `SELECT id, current_value, prefix, padding, separator
         FROM ss_model_sequence
         WHERE sequence_name = $1
         FOR UPDATE`,
        [sequenceName]
      );

      if (!seqResult?.length) {
        throw new Error(`Sequence '${sequenceName}' not found`);
      }

      const seq = seqResult[0];

      // ✅ Ensure starting value = 0
      const currentVal = parseInt(seq.current_value ?? 0, 10);

      // 👉 Always increment
      const nextVal = currentVal + 1;

      // ✅ Padding logic
      const padding = seq.padding ?? 3; // default 3 → 001
      const paddedNumber = String(nextVal).padStart(padding, '0');

      // ✅ Build final code
      const labourCode = `${seq.prefix ?? ''}${seq.separator ?? ''}${paddedNumber}`;

      // ✅ Update sequence
      await manager.query(
        `UPDATE ss_model_sequence
         SET current_value = $1, updated_at = NOW()
         WHERE id = $2`,
        [nextVal, seq.id]
      );

      // ✅ Assign value to entity
      triggerEntity[fieldName] = labourCode;
    });
  }
}