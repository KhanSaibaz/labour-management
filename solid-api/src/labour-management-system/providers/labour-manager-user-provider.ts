import {AuthUserService} from "../services/auth-user.service"
import { SelectionProvider } from '@solidxai/core';
import { PaginationQueryDto } from '@solidxai/core';
import { Injectable } from "@nestjs/common";
import {
  ISelectionProvider,
  ISelectionProviderContext,
  ISelectionProviderValues,
} from '@solidxai/core';


interface LabourManagerNameProviderContext extends ISelectionProviderContext {
  type: string;
}

const DEFAULT_LIMIT = 10000;

@SelectionProvider()
@Injectable()
export class LabourManagerNameSelectionProvider
  implements ISelectionProvider<LabourManagerNameProviderContext>
{
  constructor(private readonly AuthUserService: AuthUserService) {}
  
    name(): string {
    return 'LabourManagerNameSelectionProvider';
    }

    help(): string {
        return "# This is Auth User Name  Provider";
    }

    value(optionValue: string, ctxt: LabourManagerNameProviderContext): Promise<ISelectionProviderValues | any> {
        throw new Error("Method not implemented.");
    }

    async values(query: any, ctxt: LabourManagerNameProviderContext): Promise<readonly ISelectionProviderValues[]> {
         const paginatedQuery = new PaginationQueryDto(DEFAULT_LIMIT, 0);
         
        const userName = await this.AuthUserService.find(paginatedQuery);
        console.log(userName,'111');
        

        const selectionValues = userName?.records?.map(item => ({
            label: item.username,
            value: item.username
        })) ?? [];

        return selectionValues;
    }
}