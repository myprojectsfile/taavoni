import { ClaimType } from './claim';
import { UserFileType } from './userFile';

export interface UserType {
    _id?: string;
    username?: string;
    password?: string;
    name?: string;
    family?: string;
    fullName?: string;
    codeMelli?: string;
    mobile?: string;
    enabled?: boolean;
    confirmed?: boolean;
    claims?: ClaimType[];
    fileha?: UserFileType[];
}
