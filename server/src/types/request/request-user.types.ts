import { Role } from "../../constants/roles";

export interface RequestUser {
  id: string;
  role: Role;
  hospitalId?: string;
}
