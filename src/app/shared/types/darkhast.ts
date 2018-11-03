import { MoamelehType } from './moameleh';

export interface DarkhastType {
  _id?: string;
  username?: string;
  fullName?: string;
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
  moamelat?: MoamelehType[];
}
