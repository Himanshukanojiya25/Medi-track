import { AppointmentModel } from "../../../src/models/appointment";
import { HospitalModel } from "../../../src/models/hospital";
import { HospitalAdminModel } from "../../../src/models/hospital-admin";
import { PatientModel } from "../../../src/models/patient";
import { DoctorModel } from "../../../src/models/doctor";

describe("Appointment Service (Model-level)", () => {
  it("✅ should create appointment", async () => {
    const hospital = await HospitalModel.create({
      name: "Appointment Service Hospital",
      code: "APT-SERVICE-HOSP",
      email: "apt-service@hospital.com",
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
      name: "Appointment Admin",
      hospitalId: hospital._id,
      email: "apt-admin@hospital.com",
      passwordHash: "hashed-password",
    });

    const patient = await PatientModel.create({
      hospitalId: hospital._id,
      createdByHospitalAdminId: admin._id,
      firstName: "Service",
      lastName: "Patient",
      phone: "9222222222",
      passwordHash: "hashed-password",
      gender: "male",
    });

    const doctor = await DoctorModel.create({
      hospitalId: hospital._id,
      hospitalAdminId: admin._id,
      name: "Dr Service",
      email: "dr-service@hospital.com",
      specialization: "General",
      passwordHash: "hashed-password",
    });

    const appointment = await AppointmentModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      doctorId: doctor._id,
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      durationMinutes: 30,
      createdByHospitalAdminId: admin._id,
    });

    expect(appointment).toBeDefined();
    expect(appointment._id).toBeDefined();
  });

  it("✅ should fetch appointment by id", async () => {
    const hospital = await HospitalModel.create({
      name: "Fetch Appointment Hospital",
      code: "FETCH-APT-HOSP",
      email: "fetchapt@hospital.com",
      phone: "9999997777",
      address: {
        line1: "Street",
        city: "Mumbai",
        state: "MH",
        country: "India",
        postalCode: "400001",
      },
    });

    const admin = await HospitalAdminModel.create({
      name: "Fetch Admin",
      hospitalId: hospital._id,
      email: "fetch-admin@hospital.com",
      passwordHash: "hashed-password",
    });

    const patient = await PatientModel.create({
      hospitalId: hospital._id,
      createdByHospitalAdminId: admin._id,
      firstName: "Fetch",
      lastName: "Patient",
      phone: "9333333333",
      passwordHash: "hashed-password",
      gender: "male",
    });

    const doctor = await DoctorModel.create({
      hospitalId: hospital._id,
      hospitalAdminId: admin._id,
      name: "Dr Fetch",
      email: "dr-fetch@hospital.com",
      specialization: "General",
      passwordHash: "hashed-password",
    });

    const created = await AppointmentModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      doctorId: doctor._id,
      scheduledAt: new Date(Date.now() + 60 * 60 * 1000),
      durationMinutes: 30,
      createdByHospitalAdminId: admin._id,
    });

    const appointment = await AppointmentModel.findById(
      created._id
    );

    expect(appointment).not.toBeNull();
    expect(appointment?._id.toString()).toBe(created._id.toString());
  });
});
