import { connectDB, disconnectDB } from "../../../../src/config/mongoose";
import { BillingModel } from "../../../../src/models/billing";

import {
  createHospital,
  createHospitalAdmin,
  createPatient,
  createDoctor,
  createAppointment,
} from "../../../helpers/factories";

describe("Billing Relations", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await BillingModel.deleteMany({});
    await disconnectDB();
  });

  it("should link billing to hospital, patient, appointment & admin", async () => {
    const hospital = await createHospital();
    const admin = await createHospitalAdmin(hospital._id);
    const doctor = await createDoctor(hospital._id, admin._id);
    const patient = await createPatient(hospital._id, admin._id);
    const appointment = await createAppointment(
      hospital._id,
      doctor._id,
      patient._id
    );

    const billing = await BillingModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      appointmentId: appointment._id,
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
      createdByHospitalAdminId: admin._id,
    });

    const populated = await BillingModel.findById(billing._id)
      .populate("hospitalId")
      .populate("patientId")
      .populate("appointmentId")
      .populate("createdByHospitalAdminId");

    expect(populated?.hospitalId).toBeDefined();
    expect(populated?.patientId).toBeDefined();
    expect(populated?.appointmentId).toBeDefined();
    expect(populated?.createdByHospitalAdminId).toBeDefined();
  });
});
