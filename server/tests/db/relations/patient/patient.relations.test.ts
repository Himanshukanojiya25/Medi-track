import { connectDB, disconnectDB } from "../../../../src/config";

import { PatientModel } from "../../../../src/models/patient";
import { HospitalModel } from "../../../../src/models/hospital";
import { HospitalAdminModel } from "../../../../src/models/hospital-admin";

describe("Patient Relations", () => {
  let hospital: any;
  let admin: any;

  beforeAll(async () => {
    await connectDB();

    hospital = await HospitalModel.create({
      name: "Patient Relation Hospital",
      code: "PAT-HOSP",
      email: "pat@hospital.com",
      phone: "9000003333",
      address: {
        line1: "Street",
        city: "Mumbai",
        state: "MH",
        country: "India",
        postalCode: "400003",
      },
    });

    admin = await HospitalAdminModel.create({
      name: "Patient Admin",
      hospitalId: hospital._id,
      email: "pat-admin@hospital.com",
      passwordHash: "hashed",
      createdBy: hospital._id,
    });
  });

  afterAll(async () => {
    await PatientModel.deleteMany({});
    await disconnectDB();
  });

  it("✅ should link patient to hospital", async () => {
    const patient = await PatientModel.create({
      hospitalId: hospital._id,
      createdByHospitalAdminId: admin._id,
      firstName: "Relation",
      lastName: "Test",
      phone: "4444444444",
    });

    const populated = await PatientModel.findById(patient._id).populate("hospitalId");
    expect(populated?.hospitalId).toBeDefined();
  });

  it("✅ should link patient to hospital admin", async () => {
    const patient = await PatientModel.create({
      hospitalId: hospital._id,
      createdByHospitalAdminId: admin._id,
      firstName: "Admin",
      lastName: "Link",
      phone: "5555555555",
    });

    const populated = await PatientModel.findById(patient._id).populate(
      "createdByHospitalAdminId"
    );
    expect(populated?.createdByHospitalAdminId).toBeDefined();
  });
});
