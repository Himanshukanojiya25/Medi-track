import { Schema } from 'mongoose';
import { IBilling } from './billing.types';
import { BillingStatus } from '../../constants/status';

export const BillingSchema = new Schema<IBilling>(
  {
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
      index: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
      index: true,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      index: true,
    },

    invoiceNumber: {
      type: String,
      required: true,
      trim: true,
    },

    lineItems: [
      {
        description: { type: String, required: true, trim: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        amount: { type: Number, required: true, min: 0 },
      },
    ],

    subTotal: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, required: true, min: 0 },
    dueAmount: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: Object.values(BillingStatus),
      default: BillingStatus.DRAFT,
      index: true,
    },

    issuedAt: { type: Date },
    paidAt: { type: Date },

    createdByHospitalAdminId: {
      type: Schema.Types.ObjectId,
      ref: 'HospitalAdmin',
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Invoice number must be unique per hospital
 */
BillingSchema.index(
  { hospitalId: 1, invoiceNumber: 1 },
  { unique: true }
);
