import HospitalService from "../../../src/services/hospital/hospital.service";
import { HospitalModel } from "../../../src/models/hospital";

describe("Hospital Service", () => {
  let hospitalId: string;

  it("should create hospital", async () => {
    const hospital = await HospitalModel.create({
      name: "Test Hospital",
      code: "TEST-HOSP",
      email: "test@hospital.com",
      phone: "9999999999",
      address: {
        line1: "Street",
        city: "Mumbai",
        state: "MH",
        country: "India",
        postalCode: "400001",
      },
    });

    hospitalId = hospital._id.toString();
    expect(hospital).toBeDefined();
  });

  it("should update hospital", async () => {
    await HospitalService.updateById(hospitalId, {
      name: "Updated Hospital",
    });

    const fresh = await HospitalModel.findById(hospitalId).lean();
    expect(fresh?.name).toBe("Updated Hospital");
  });

  it("should deactivate hospital", async () => {
    await HospitalService.deactivateById(hospitalId);

    const fresh = await HospitalModel.findById(hospitalId).lean();
    expect(fresh?.isActive).toBe(false);
  });
});
