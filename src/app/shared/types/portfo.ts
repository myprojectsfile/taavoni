import { MoamelehType } from './moameleh';
import { UserType } from './user';

export interface PortfoType {
  _id?: string;
  tedadSahm?: number;
  user?: [UserType];
  moameleha?: [MoamelehType];
}
