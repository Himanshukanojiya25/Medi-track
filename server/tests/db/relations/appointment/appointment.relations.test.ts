import { connectDB, disconnectDB } from "../../../../src/config";

import { AppointmentModel } from "../../../../src/models/appointment";
import { HospitalModel } from "../../../../src/models/hospital";
import { HospitalAdminModel } from "../../../../src/models/hospital-admin";
import { PatientModel } from "../../../../src/models/patient";
import { DoctorModel } from "../../../../src/models/doctor";

describe("Appointment Relations", () => {
  let hospital: any;
  let admin: any;
  let patient: any;
  let doctor: any;

  beforeAll(async () => {
    await connectDB();

    hospital = await HospitalModel.create({
      name: "Appointment Relation Hospital",
      code: "APT-HOSP",
      email: "apt@hospital.com",
      phone: "9000001111",
      address: {
        line1: "Street 1",
        city: "Mumbai",
        state: "MH",
        country: "India",
        postalCode: "400001",
      },
    });

    admin = await HospitalAdminModel.create({
      name: "Appointment Admin",
      hospitalId: hospital._id,
      email: "apt-admin@hospital.com",
      passwordHash: "hashed",
      createdBy: hospital._id,
    });

    patient = await PatientModel.create({
      hospitalId: hospital._id,
      createdByHospitalAdminId: admin._id,
      firstName: "Rel",
      lastName: "Patient",
      phone: "9333333333",
    });

    doctor = await DoctorModel.create({
      hospitalId: hospital._id,
      hospitalAdminId: admin._id,
      name: "Dr Rel",
      email: "dr-rel@hospital.com",
      phone: "9444444444",
      specialization: "General",
    });
  });

  afterAll(async () => {
    await AppointmentModel.deleteMany({});
    await disconnectDB();
  });

  it("✅ should link appointment to hospital", async () => {
    const appt = await AppointmentModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      doctorId: doctor._id,
      scheduledAt: new Date(),
      durationMinutes: 30,
    });

    const populated = await AppointmentModel.findById(appt._id).populate("hospitalId");
    expect(populated?.hospitalId).toBeDefined();
  });

  it("✅ should link appointment to patient", async () => {
    const appt = await AppointmentModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      doctorId: doctor._id,
      scheduledAt: new Date(),
      durationMinutes: 30,
    });

    const populated = await AppointmentModel.findById(appt._id).populate("patientId");
    expect(populated?.patientId).toBeDefined();
  });

  it("✅ should link appointment to doctor", async () => {
    const appt = await AppointmentModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      doctorId: doctor._id,
      scheduledAt: new Date(),
      durationMinutes: 30,
    });

    const populated = await AppointmentModel.findById(appt._id).populate("doctorId");
    expect(populated?.doctorId).toBeDefined();
  });

  it("✅ should link appointment to hospital admin (creator)", async () => {
    const appt = await AppointmentModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      doctorId: doctor._id,
      scheduledAt: new Date(),
      durationMinutes: 30,
      createdByHospitalAdminId: admin._id,
    });

    const populated = await AppointmentModel.findById(appt._id).populate(
      "createdByHospitalAdminId"
    );
    expect(populated?.createdByHospitalAdminId).toBeDefined();
  });
});
