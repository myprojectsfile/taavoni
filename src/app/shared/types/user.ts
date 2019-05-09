import { ClaimType } from './claim';
import { UserFileType } from './userFile';
import { DarkhastType } from './queue';
import { MoamelehType } from './moameleh';

export interface UserType {
    _id?: string;
    username?: string;
    password?: string;
    name?: string;
    family?: string;
    fullName?: string;
    mobile?: string;
    codeMelli?: string;
    enabled?: boolean;
    confirmed?: boolean;
    tedadSahm?: number;
    darkhastha?: DarkhastType[];
    moameleha?: MoamelehType[];
    claimha?: ClaimType[];
    fileha?: UserFileType[];
}
