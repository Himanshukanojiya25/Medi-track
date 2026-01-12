import { Types } from 'mongoose';
import { BillingStatus } from '../../constants/status';

export interface IBillingLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface IBilling {
  _id: Types.ObjectId;

  hospitalId: Types.ObjectId;
  patientId: Types.ObjectId;
  appointmentId?: Types.ObjectId;

  invoiceNumber: string;

  lineItems: IBillingLineItem[];

  subTotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;

  status: BillingStatus;

  issuedAt?: Date;
  paidAt?: Date;

  createdByHospitalAdminId?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}
