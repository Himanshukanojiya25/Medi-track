import { model } from 'mongoose';
import { AppointmentSchema } from './appointment.schema';
import { IAppointment } from './appointment.types';

export const AppointmentModel = model<IAppointment>(
  'Appointment',
  AppointmentSchema
);
