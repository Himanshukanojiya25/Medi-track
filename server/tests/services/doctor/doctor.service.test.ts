import { DoctorModel } from "../../../src/models/doctor";
import { HospitalModel } from "../../../src/models/hospital";
import { HospitalAdminModel } from "../../../src/models/hospital-admin";

describe("Doctor Service (Model-level)", () => {
  it("✅ should create doctor", async () => {
    const hospital = await HospitalModel.create({
      name: "Doctor Hospital",
      code: "DOC-HOSP",
      email: "doc@hospital.com",
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
      name: "Doctor Admin",
      hospitalId: hospital._id,
      email: "doc-admin@hospital.com",
      passwordHash: "hashed-password",
    });

    const doctor = await DoctorModel.create({
      hospitalId: hospital._id,
      hospitalAdminId: admin._id,
      name: "Dr Service",
      email: "service@doctor.com",
      specialization: "General",
      passwordHash: "hashed-password",
    });

    expect(doctor).toBeDefined();
    expect(doctor._id).toBeDefined();
  });

  it("✅ should fetch doctor by id", async () => {
    const doctor = await DoctorModel.create({
      hospitalId: new HospitalModel()._id,
      hospitalAdminId: new HospitalAdminModel()._id,
      name: "Fetch Doctor",
      email: "fetch@doctor.com",
      specialization: "General",
      passwordHash: "hashed-password",
    });

    const found = await DoctorModel.findById(doctor._id);
    expect(found).not.toBeNull();
  });
});
