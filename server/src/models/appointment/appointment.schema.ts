import { Schema } from 'mongoose';
import { IAppointment } from './appointment.types';
import { AppointmentStatus } from '../../constants/status';

export const AppointmentSchema = new Schema<IAppointment>(
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
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
      index: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 5,
      max: 480,
    },

    reason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.SCHEDULED,
      index: true,
    },

    /**
     * =========================
     * CANCELLATION METADATA
     * =========================
     */
    cancelledReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
      index: true,
    },

    cancelledBy: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },

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
 * =========================
 * PHASE 3.1 — DB INDEXING
 * =========================
 */

/**
 * Prevent overlapping appointments for the same doctor at the same time.
 */
AppointmentSchema.index(
  { doctorId: 1, scheduledAt: 1 },
  { unique: true }
);

/**
 * Fast hospital appointment listing
 */
AppointmentSchema.index({
  hospitalId: 1,
  scheduledAt: -1,
});

/**
 * Doctor dashboard
 */
AppointmentSchema.index({
  doctorId: 1,
  scheduledAt: -1,
});

/**
 * Patient history
 */
AppointmentSchema.index({
  patientId: 1,
  scheduledAt: -1,
});

/**
 * Status-based filtering
 */
AppointmentSchema.index({
  status: 1,
  scheduledAt: -1,
});
