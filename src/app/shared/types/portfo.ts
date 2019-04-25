import { MoamelehType } from './moameleh';
import { UserType } from './user';

export interface PortfoType {
  _id?: string;
  username?: string;
  userId?: string;
  fullName?: string;
  tedadSahm?: number;
  arzeshSahm?: number;
  moamelat?: MoamelehType[];
  user?: [UserType];
  moameleha?: [MoamelehType];
}
