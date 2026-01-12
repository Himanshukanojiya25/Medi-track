import { HospitalModel } from "../../src/models/hospital";

/**
 * createTestHospital
 * ------------------
 * Always creates a FULLY VALID Hospital document
 * for tests that need a hospital reference.
 *
 * - No partial payloads
 * - No dependency on other tests
 * - Safe for repeated calls
 */
export async function createTestHospital() {
  const unique = Date.now();

  const hospital = await HospitalModel.create({
    name: `Test Hospital ${unique}`,
    code: `TEST-HOSP-${unique}`,
    email: `test-hospital-${unique}@example.com`,
    phone: "9999999999",
    address: {
      line1: "MG Road",
      city: "Mumbai",
      state: "MH",
      country: "India",
      postalCode: "400001",
    },
  });

  return hospital;
}
