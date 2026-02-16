import {AuthUserService} from "../services/auth-user.service"
import { SelectionProvider } from '@solidxai/core';
import { PaginationQueryDto } from '@solidxai/core';
import { Injectable } from "@nestjs/common";
import {
  ISelectionProvider,
  ISelectionProviderContext,
  ISelectionProviderValues,
} from '@solidxai/core';


interface LabourUserNameProviderContext extends ISelectionProviderContext {
  type: string;
}

const DEFAULT_LIMIT = 10000;

@SelectionProvider()
@Injectable()
export class LabourUserNameSelectionProvider
  implements ISelectionProvider<LabourUserNameProviderContext>
{
  constructor(private readonly AuthUserService: AuthUserService) {}
  
    name(): string {
    return 'LabourUserNameSelectionProvider';
    }

    help(): string {
        return "# This is Auth User Name  Provider";
    }

    value(optionValue: string, ctxt: LabourUserNameProviderContext): Promise<ISelectionProviderValues | any> {
        throw new Error("Method not implemented.");
    }

    async values(query: any, ctxt: LabourUserNameProviderContext): Promise<readonly ISelectionProviderValues[]> {
         const paginatedQuery = new PaginationQueryDto(DEFAULT_LIMIT, 0);
         
        const userName = await this.AuthUserService.find(paginatedQuery);

        const selectionValues = userName?.records?.map(item => ({
            label: item.username,
            value: item.username
        })) ?? [];

        return selectionValues;
    }
}