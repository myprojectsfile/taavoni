import { MoamelehType } from './moameleh';
import { UserType } from './user';

export interface DarkhastType {
  _id?: string;
  tedadSahm?: number;
  gheymatSahm?: number;
  tedadMoamelehShodeh?: number;
  tedadBaghiMandeh?: number;
  arzeshSahm?: number;
  tarikhDarkhast?: string;
  tarikhUpdate?: string;
  vazeiat?: string;
  tozihat?: string;
  noeDarkhst?: string;
  user?: UserType;
  moameleha?: MoamelehType[];
}
