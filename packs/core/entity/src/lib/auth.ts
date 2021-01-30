import { Name } from "./user";

export interface AuthPayload {
  id: string;
  email: string;
  name: Omit<Name, 'last'>
}
export interface AuthResponse {
  payload: AuthPayload;
  access_token: string;
}
