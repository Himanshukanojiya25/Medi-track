import { Types } from "mongoose";
import {
  upsertDoctorAvailabilityService,
  getDoctorAvailabilityService,
} from "../../../src/services/doctor-availability/doctor-availability.service";
import { DoctorAvailabilityModel } from "../../../src/models/doctor-availability";

describe("Doctor Availability Service", () => {
  const doctorId = new Types.ObjectId().toHexString();

  afterEach(async () => {
    await DoctorAvailabilityModel.deleteMany({});
  });

  describe("upsertDoctorAvailabilityService", () => {
    it("should create availability for a doctor", async () => {
      const availability = await upsertDoctorAvailabilityService({
        doctorId,
        slotDurationMinutes: 15,
        weeklyAvailability: [
          {
            dayOfWeek: 1, // Monday
            slots: [
              { start: "10:00", end: "13:00" },
              { start: "16:00", end: "19:00" },
            ],
          },
        ],
      });

      expect(availability).toBeDefined();
      expect(availability.doctorId).toBeInstanceOf(Types.ObjectId);
      expect(availability.slotDurationMinutes).toBe(15);
      expect(availability.weeklyAvailability.length).toBe(1);
      expect(availability.isActive).toBe(true);
    });

    it("should update availability if already exists (upsert)", async () => {
      await upsertDoctorAvailabilityService({
        doctorId,
        slotDurationMinutes: 15,
        weeklyAvailability: [
          {
            dayOfWeek: 2,
            slots: [{ start: "09:00", end: "12:00" }],
          },
        ],
      });

      const updated = await upsertDoctorAvailabilityService({
        doctorId,
        slotDurationMinutes: 30,
        weeklyAvailability: [
          {
            dayOfWeek: 2,
            slots: [{ start: "10:00", end: "14:00" }],
          },
        ],
      });

      expect(updated.slotDurationMinutes).toBe(30);
      expect(updated.weeklyAvailability[0].slots[0].start).toBe("10:00");

      const count = await DoctorAvailabilityModel.countDocuments({
        doctorId: new Types.ObjectId(doctorId),
      });
      expect(count).toBe(1); // 🔥 ensure single doc per doctor
    });
  });

  describe("getDoctorAvailabilityService", () => {
    it("should return active availability for a doctor", async () => {
      await DoctorAvailabilityModel.create({
        doctorId: new Types.ObjectId(doctorId),
        slotDurationMinutes: 20,
        weeklyAvailability: [
          {
            dayOfWeek: 5, // Friday
            slots: [{ start: "11:00", end: "15:00" }],
          },
        ],
        isActive: true,
      });

      const availability = await getDoctorAvailabilityService(doctorId);

      expect(availability).toBeDefined();
      expect(availability!.doctorId).toBeInstanceOf(Types.ObjectId);
      expect(availability!.weeklyAvailability[0].dayOfWeek).toBe(5);
    });

    it("should return null if no active availability exists", async () => {
      const availability = await getDoctorAvailabilityService(
        new Types.ObjectId().toHexString()
      );

      expect(availability).toBeNull();
    });
  });
});
