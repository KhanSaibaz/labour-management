import { WorkTypeService } from  "../services/work-type.service";
import { SelectionProvider } from '@solidxai/core';
import { PaginationQueryDto } from '@solidxai/core';
import { Injectable } from "@nestjs/common";
import {
  ISelectionProvider,
  ISelectionProviderContext,
  ISelectionProviderValues,
} from '@solidxai/core';

interface WorkTypeProviderContext extends ISelectionProviderContext {
  type: string;
}

const DEFAULT_LIMIT = 10000;

@SelectionProvider()
@Injectable()
export class WorkTypeSelectionProvider
  implements ISelectionProvider<WorkTypeProviderContext>
{
  constructor(private readonly workTypeService: WorkTypeService) {}
  
    name(): string {
    return 'WorkTypeSelectionProvider';
    }

    help(): string {
        return "# This is Work Type  Provider";
    }

    value(optionValue: string, ctxt: WorkTypeProviderContext): Promise<ISelectionProviderValues | any> {
        throw new Error("Method not implemented.");
    }

    async values(query: any, ctxt: WorkTypeProviderContext): Promise<readonly ISelectionProviderValues[]> {
         const paginatedQuery = new PaginationQueryDto(DEFAULT_LIMIT, 0);
         
        const workType = await this.workTypeService.find(paginatedQuery);
        const sortedRecords = workType?.records?.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const selectionValues = sortedRecords?.map(item => ({
            label: item.name,
            value: item.name
        })) ?? [];

        return selectionValues;
    }
}