import { connectDB, disconnectDB } from "../../../src/config/mongoose";
import { AppointmentModel } from "../../../src/models/appointment";
import { HospitalModel } from "../../../src/models/hospital";
import { HospitalAdminModel } from "../../../src/models/hospital-admin";
import { PatientModel } from "../../../src/models/patient";
import { DoctorModel } from "../../../src/models/doctor";

describe("Appointment Service (Model-level)", () => {
  let appointmentId: string;

  beforeAll(async () => {
    await connectDB();

    const hospital = await HospitalModel.create({
      name: "APT Hospital",
      code: "APT-HOSP",
      email: "apt@hospital.com",
      phone: "9999999999",
      address: {
        line1: "Street",
        city: "Mumbai",
        state: "MH",
        country: "India",
        postalCode: "400001",
      },
    });

    const admin = await HospitalAdminModel.create({
      name: "Admin",
      hospitalId: hospital._id,
      email: "admin@apt.com",
      passwordHash: "hashed",
    });

    const patient = await PatientModel.create({
      hospitalId: hospital._id,
      createdByHospitalAdminId: admin._id,
      firstName: "Test",
      lastName: "Patient",
      phone: "9111111111",
      passwordHash: "hashed",
    });

    const doctor = await DoctorModel.create({
      hospitalId: hospital._id,
      hospitalAdminId: admin._id,
      name: "Dr Test",
      email: "dr@apt.com",
      specialization: "General",
      passwordHash: "hashed",
    });

    const appointment = await AppointmentModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      doctorId: doctor._id,
      scheduledAt: new Date(),
      durationMinutes: 30,
      createdByHospitalAdminId: admin._id,
    });

    appointmentId = appointment._id.toString();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it("should fetch appointment by id", async () => {
    const appointment = await AppointmentModel.findById(appointmentId);
    expect(appointment).not.toBeNull();
  });
});
