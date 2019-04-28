import { UserType } from './user';
import { DarkhastType } from './queue';

export interface MoamelehType {
  _id?: string;
  tarikhMoameleh?: string;
  noeMoameleh?: string;
  tedadSahmMoameleh: number;
  gheymatMoameleh?: number;
  arzeshSahmMoameleh?: number;
  kharidar?: UserType;
  forushandeh?: UserType;
  sabtKonandeh?: UserType;
  darkhastKharid?: DarkhastType;
  darkhastForush?: DarkhastType;
}
