import { connectDB, disconnectDB } from "../../../../src/config/mongoose";
import { PatientModel } from "../../../../src/models/patient";

import {
  createHospital,
  createHospitalAdmin,
  createPatient,
} from "../../../helpers/factories";

describe("Patient Relations", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await PatientModel.deleteMany({});
    await disconnectDB();
  });

  it("should link patient to hospital", async () => {
    const hospital = await createHospital();
    const admin = await createHospitalAdmin(hospital._id);

    const patient = await createPatient(hospital._id, admin._id);

    const populated = await PatientModel.findById(patient._id).populate("hospitalId");
    expect(populated?.hospitalId).toBeDefined();
  });

  it("should link patient to hospital admin", async () => {
    const hospital = await createHospital();
    const admin = await createHospitalAdmin(hospital._id);

    const patient = await createPatient(hospital._id, admin._id);

    const populated = await PatientModel.findById(patient._id).populate(
      "createdByHospitalAdminId"
    );
    expect(populated?.createdByHospitalAdminId).toBeDefined();
  });
});
