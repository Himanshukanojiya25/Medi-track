import { BaseDocument, Address } from "../../types/db";
import { HOSPITAL_STATUS } from "../../constants/status";
import { SUBSCRIPTION_PLANS } from "../../constants/subscription/plans.constants";

export interface Hospital extends BaseDocument {
  name: string;
  code: string;
  email: string;
  phone: string;

  address: Address;

  status: HOSPITAL_STATUS;
  isActive: boolean;

  /* ================================
     SUBSCRIPTION (PHASE 2)
  ================================= */

  plan: (typeof SUBSCRIPTION_PLANS)[keyof typeof SUBSCRIPTION_PLANS];
  planActivatedAt: Date;
}
