import { Types } from "mongoose";
import { PlanService } from "../../../src/services/subscription/plan.service";
import { HospitalModel } from "../../../src/models/hospital";
import { SUBSCRIPTION_PLANS } from "../../../src/constants/subscription/plans.constants";

describe("PlanService", () => {
  let hospitalId: Types.ObjectId;

  beforeEach(async () => {
    const hospital = await HospitalModel.create({
      name: "Subscription Test Hospital",
      code: "SUBS001",
      email: "sub@test.com",
      phone: "9999999999",
      address: {
        line1: "Line 1",
        city: "City",
        state: "State",
        country: "Country",
        postalCode: "111111",
      },
      plan: SUBSCRIPTION_PLANS.FREE,
    });

    hospitalId = hospital._id;
  });

  afterEach(async () => {
    await HospitalModel.deleteMany({});
  });

  it("should return hospital plan (default FREE)", async () => {
    const result = await PlanService.getHospitalPlan(hospitalId);
    expect(result.plan).toBe(SUBSCRIPTION_PLANS.FREE);
  });

  it("should update hospital plan to PRO", async () => {
    const result = await PlanService.updateHospitalPlan(
      hospitalId,
      SUBSCRIPTION_PLANS.PRO
    );
    expect(result.plan).toBe(SUBSCRIPTION_PLANS.PRO);
  });

  it("should throw error if hospital not found", async () => {
    await expect(
      PlanService.getHospitalPlan(new Types.ObjectId())
    ).rejects.toThrow("Hospital not found");
  });
});
