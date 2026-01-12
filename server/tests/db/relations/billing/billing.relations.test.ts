import { connectDB, disconnectDB } from "../../../../src/config";

import { BillingModel } from "../../../../src/models/billing";
import { HospitalModel } from "../../../../src/models/hospital";
import { HospitalAdminModel } from "../../../../src/models/hospital-admin";
import { PatientModel } from "../../../../src/models/patient";
import { AppointmentModel } from "../../../../src/models/appointment";
import { SYSTEM_ROLES } from "../../../../src/constants/roles";

describe("Billing Relations", () => {
  let hospital: any;
  let admin: any;
  let patient: any;
  let appointment: any;

  beforeAll(async () => {
    await connectDB();

    // ✅ ENSURE HOSPITAL
    hospital = await HospitalModel.findOne({});
    if (!hospital) {
      hospital = await HospitalModel.create({
        name: "Billing Relation Hospital",
        code: "BILL-REL-HOSP",
        email: "bill-rel@hospital.com",
        phone: "9000002222",
      });
    }

    // ✅ ENSURE HOSPITAL ADMIN
    admin = await HospitalAdminModel.findOne({ hospitalId: hospital._id });
    if (!admin) {
      admin = await HospitalAdminModel.create({
        hospitalId: hospital._id,
        name: "Billing Relation Admin",
        email: "bill-rel-admin@hospital.com",
        passwordHash: "hashed",
        role: SYSTEM_ROLES.HOSPITAL_ADMIN,
      });
    }

    // ✅ ENSURE PATIENT
    patient = await PatientModel.findOne({ hospitalId: hospital._id });
    if (!patient) {
      patient = await PatientModel.create({
        hospitalId: hospital._id,
        createdByHospitalAdminId: admin._id,
        firstName: "Billing",
        lastName: "Relation",
        phone: "9666666666",
      });
    }

    // appointment optional
    appointment = await AppointmentModel.findOne({ hospitalId: hospital._id });
  });

  afterAll(async () => {
    await BillingModel.deleteMany({});
    await disconnectDB();
  });

  it("✅ should link billing to hospital", async () => {
    const billing = await BillingModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      invoiceNumber: `INV-${Date.now()}`,
      lineItems: [
        { description: "Fee", quantity: 1, unitPrice: 300, amount: 300 },
      ],
      subTotal: 300,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 300,
      paidAmount: 0,
      dueAmount: 300,
    });

    const populated = await BillingModel.findById(billing._id).populate(
      "hospitalId"
    );

    expect(populated?.hospitalId).toBeDefined();
  });

  it("✅ should link billing to patient", async () => {
    const billing = await BillingModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      invoiceNumber: `INV-${Date.now()}`,
      lineItems: [
        { description: "Fee", quantity: 1, unitPrice: 400, amount: 400 },
      ],
      subTotal: 400,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 400,
      paidAmount: 0,
      dueAmount: 400,
    });

    const populated = await BillingModel.findById(billing._id).populate(
      "patientId"
    );

    expect(populated?.patientId).toBeDefined();
  });

  it("✅ should link billing to appointment (optional)", async () => {
    const billing = await BillingModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      appointmentId: appointment?._id,
      invoiceNumber: `INV-${Date.now()}`,
      lineItems: [
        { description: "Fee", quantity: 1, unitPrice: 600, amount: 600 },
      ],
      subTotal: 600,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 600,
      paidAmount: 0,
      dueAmount: 600,
    });

    const populated = await BillingModel.findById(billing._id).populate(
      "appointmentId"
    );

    if (appointment) {
      expect(populated?.appointmentId).toBeDefined();
    }
  });

  it("✅ should link billing to hospital admin (creator)", async () => {
    const billing = await BillingModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      invoiceNumber: `INV-${Date.now()}`,
      lineItems: [
        { description: "Fee", quantity: 1, unitPrice: 700, amount: 700 },
      ],
      subTotal: 700,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 700,
      paidAmount: 0,
      dueAmount: 700,
      createdByHospitalAdminId: admin._id,
    });

    const populated = await BillingModel.findById(billing._id).populate(
      "createdByHospitalAdminId"
    );

    expect(populated?.createdByHospitalAdminId).toBeDefined();
  });
});
