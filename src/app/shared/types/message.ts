import { UserType } from './user';

export interface MessageType {
  _id?: string;
  name?: String;
  phone?: String;
  email?: String;
  message?: String;
  girandeh?: UserType;
  ferestandeh?: UserType;
  tarikh?: String;
  pasokh?: MessageType;
}
