import mongoose, { Types } from "mongoose";
import NotificationEventService from "../../../src/services/notification/notification.event.service";
import { NotificationModel } from "../../../src/models/notification";

describe("NotificationEventService", () => {
  const hospitalId = new Types.ObjectId();
  const patientId = new Types.ObjectId();
  const doctorId = new Types.ObjectId();
  const appointmentId = new Types.ObjectId();
  const prescriptionId = new Types.ObjectId();

  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
  });

  afterEach(async () => {
    await NotificationModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("creates notifications for appointment booked (patient + doctor)", async () => {
    await NotificationEventService.appointmentBooked({
      hospitalId,
      patientId,
      doctorId,
      appointmentId,
    });

    const notifications = await NotificationModel.find({}).lean();

    expect(notifications.length).toBe(2);

    const recipients = notifications.map(n => n.recipientId.toString());
    expect(recipients).toContain(patientId.toString());
    expect(recipients).toContain(doctorId.toString());

    notifications.forEach(n => {
      expect(n.status).toBe("unread");
      expect(n.metadata?.appointmentId).toBe(appointmentId.toString());
    });
  });

  it("creates notifications for appointment cancelled (patient + doctor)", async () => {
    await NotificationEventService.appointmentCancelled({
      hospitalId,
      patientId,
      doctorId,
      appointmentId,
      cancelledBy: "patient",
    });

    const notifications = await NotificationModel.find({}).lean();

    expect(notifications.length).toBe(2);

    notifications.forEach(n => {
      expect(n.metadata?.appointmentId).toBe(appointmentId.toString());
      expect(n.metadata?.cancelledBy).toBe("patient");
    });
  });

  it("creates notification for appointment completed (patient only)", async () => {
    await NotificationEventService.appointmentCompleted({
      hospitalId,
      patientId,
      doctorId,
      appointmentId,
    });

    const notifications = await NotificationModel.find({}).lean();

    expect(notifications.length).toBe(1);
    expect(notifications[0].recipientId.toString()).toBe(
      patientId.toString()
    );
  });

  it("creates notification for prescription created (patient only)", async () => {
    await NotificationEventService.prescriptionCreated({
      hospitalId,
      patientId,
      doctorId,
      prescriptionId,
      appointmentId,
    });

    const notifications = await NotificationModel.find({}).lean();

    expect(notifications.length).toBe(1);

    const n = notifications[0];
    expect(n.recipientId.toString()).toBe(patientId.toString());
    expect(n.metadata?.prescriptionId).toBe(prescriptionId.toString());
    expect(n.metadata?.appointmentId).toBe(appointmentId.toString());
  });
});
