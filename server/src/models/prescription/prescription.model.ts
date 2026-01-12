import { model } from 'mongoose';
import { PrescriptionSchema } from './prescription.schema';
import { IPrescription } from './prescription.types';

export const PrescriptionModel = model<IPrescription>(
  'Prescription',
  PrescriptionSchema
);
