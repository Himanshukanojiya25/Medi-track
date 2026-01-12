import { model } from 'mongoose';
import { PatientSchema } from './patient.schema';
import { IPatient } from './patient.types';

export const PatientModel = model<IPatient>('Patient', PatientSchema);
