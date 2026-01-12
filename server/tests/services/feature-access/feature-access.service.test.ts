import { Types } from "mongoose";
import { FeatureAccessService } from "../../../src/services/feature-access/feature-access.service";
import { HospitalModel } from "../../../src/models/hospital";
import { FEATURES } from "../../../src/types/feature-access/feature.types";
import { SUBSCRIPTION_PLANS } from "../../../src/constants/subscription/plans.constants";

describe("FeatureAccessService", () => {
  let hospitalId: Types.ObjectId;

  beforeEach(async () => {
    const hospital = await HospitalModel.create({
      name: "Feature Test Hospital",
      code: "FEATURE001",
      email: "feature@test.com",
      phone: "9999999999",
      address: {
        line1: "Line 1",
        city: "City",
        state: "State",
        country: "Country",
        postalCode: "123456",
      },
      plan: SUBSCRIPTION_PLANS.FREE,
    });

    hospitalId = hospital._id;
  });

  afterEach(async () => {
    await HospitalModel.deleteMany({});
  });

  it("should allow AI_CHAT for FREE plan", async () => {
    const allowed = await FeatureAccessService.hasAccess(
      hospitalId,
      FEATURES.AI_CHAT
    );
    expect(allowed).toBe(true);
  });

  it("should deny ADVANCED_ANALYTICS for FREE plan", async () => {
    const allowed = await FeatureAccessService.hasAccess(
      hospitalId,
      FEATURES.ADVANCED_ANALYTICS
    );
    expect(allowed).toBe(false);
  });
});
