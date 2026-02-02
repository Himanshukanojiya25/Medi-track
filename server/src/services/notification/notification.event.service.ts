import NotificationService from "./notification.service";
import { NotificationEvents } from "../../constants/notification/notification.events";
import { Types } from "mongoose";

/**
 * Notification Event Service
 * --------------------------
 * Central event dispatcher for system notifications
 */
export default class NotificationEventService {
  /**
   * =========================
   * APPOINTMENT EVENTS
   * =========================
   */

  static async appointmentBooked(payload: {
    hospitalId: Types.ObjectId;
    patientId: Types.ObjectId;
    doctorId: Types.ObjectId;
    appointmentId: Types.ObjectId;
  }) {
    const event = NotificationEvents.APPOINTMENT_BOOKED;

    // Notify patient
    await NotificationService.create({
      hospitalId: payload.hospitalId.toString(),
      recipientId: payload.patientId.toString(),
      recipientRole: "patient",
      title: event.title,
      message: event.message,
      type: event.type,
      metadata: {
        appointmentId: payload.appointmentId.toString(),
      },
    });

    // Notify doctor
    await NotificationService.create({
      hospitalId: payload.hospitalId.toString(),
      recipientId: payload.doctorId.toString(),
      recipientRole: "doctor",
      title: event.title,
      message: event.message,
      type: event.type,
      metadata: {
        appointmentId: payload.appointmentId.toString(),
      },
    });
  }

  static async appointmentCancelled(payload: {
    hospitalId: Types.ObjectId;
    patientId: Types.ObjectId;
    doctorId: Types.ObjectId;
    appointmentId: Types.ObjectId;
    cancelledBy: "patient" | "doctor";
  }) {
    const event = NotificationEvents.APPOINTMENT_CANCELLED;

    // Notify patient
    await NotificationService.create({
      hospitalId: payload.hospitalId.toString(),
      recipientId: payload.patientId.toString(),
      recipientRole: "patient",
      title: event.title,
      message: event.message,
      type: event.type,
      metadata: {
        appointmentId: payload.appointmentId.toString(),
        cancelledBy: payload.cancelledBy,
      },
    });

    // Notify doctor
    await NotificationService.create({
      hospitalId: payload.hospitalId.toString(),
      recipientId: payload.doctorId.toString(),
      recipientRole: "doctor",
      title: event.title,
      message: event.message,
      type: event.type,
      metadata: {
        appointmentId: payload.appointmentId.toString(),
        cancelledBy: payload.cancelledBy,
      },
    });
  }

  static async appointmentCompleted(payload: {
    hospitalId: Types.ObjectId;
    patientId: Types.ObjectId;
    doctorId: Types.ObjectId;
    appointmentId: Types.ObjectId;
  }) {
    const event = NotificationEvents.APPOINTMENT_COMPLETED;

    // Notify patient
    await NotificationService.create({
      hospitalId: payload.hospitalId.toString(),
      recipientId: payload.patientId.toString(),
      recipientRole: "patient",
      title: event.title,
      message: event.message,
      type: event.type,
      metadata: {
        appointmentId: payload.appointmentId.toString(),
      },
    });
  }

  /**
   * =========================
   * PRESCRIPTION EVENTS
   * =========================
   */

  static async prescriptionCreated(payload: {
    hospitalId: Types.ObjectId;
    patientId: Types.ObjectId;
    doctorId: Types.ObjectId;
    prescriptionId: Types.ObjectId;
    appointmentId: Types.ObjectId;
  }) {
    const event = NotificationEvents.PRESCRIPTION_CREATED;

    // Notify patient only
    await NotificationService.create({
      hospitalId: payload.hospitalId.toString(),
      recipientId: payload.patientId.toString(),
      recipientRole: "patient",
      title: event.title,
      message: event.message,
      type: event.type,
      metadata: {
        prescriptionId: payload.prescriptionId.toString(),
        appointmentId: payload.appointmentId.toString(),
      },
    });
  }
}
