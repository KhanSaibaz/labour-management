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
  ) { }

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

    if (typeof context === 'string') {
      try {
        context = JSON.parse(context);
      } catch (e) {
        throw new Error(`Invalid computedFieldValueProviderCtxt JSON: ${context}`);
      }
    }

    if (!context || !context.sequenceName) {
      throw new Error('sequenceName not provided in computed field context');
    }

    const { sequenceName } = context;
    const fieldName = computedFieldMetadata.fieldName;

    return this.entityManager.transaction(async (manager) => {
      try {
        // ✅ snake_case columns - no double quotes
        const seqResult = await manager.query(
          `SELECT id, current_value, prefix, padding, separator
         FROM ss_model_sequence
         WHERE sequence_name = $1
         FOR UPDATE`,
          [sequenceName]
        );

        if (!seqResult || seqResult.length === 0) {
          throw new Error(`Sequence '${sequenceName}' not found`);
        }

        const seq = seqResult[0];
        const nextVal = parseInt(seq.current_value, 10) + 1; 
        const padding = seq.padding || 2;
        const paddedNumber = String(nextVal).padStart(padding, '0');
        const labourCode = `${seq.prefix || ''}${seq.separator || ''}${paddedNumber}`;

        // ✅ snake_case update
        await manager.query(
          `UPDATE ss_model_sequence
         SET current_value = $1, updated_at = NOW()
         WHERE id = $2`,
          [nextVal, seq.id]
        );

        triggerEntity[fieldName] = labourCode;
      } catch (error) {
        console.error(`[LabourSequenceProvider] Error:`, error.message);
        throw error;
      }
    });
  }
}