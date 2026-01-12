import { connectDB, disconnectDB } from "../../../../src/config";

import { BillingModel } from "../../../../src/models/billing";
import { HospitalModel } from "../../../../src/models/hospital";
import { HospitalAdminModel } from "../../../../src/models/hospital-admin";
import { PatientModel } from "../../../../src/models/patient";
import { AppointmentModel } from "../../../../src/models/appointment";

import { BillingStatus } from "../../../../src/constants/status";

async function seedBilling() {
  await connectDB();

  const hospital = await HospitalModel.findOne({ code: "HOSP001" });
  if (!hospital) throw new Error("Hospital not found");

  const admin = await HospitalAdminModel.findOne({ hospitalId: hospital._id });
  if (!admin) throw new Error("Hospital Admin not found");

  const patient = await PatientModel.findOne({ hospitalId: hospital._id });
  if (!patient) throw new Error("Patient not found");

  const appointment = await AppointmentModel.findOne({ hospitalId: hospital._id });

  const invoiceNumber = "INV-0001";

  const exists = await BillingModel.findOne({
    hospitalId: hospital._id,
    invoiceNumber,
  });

  if (!exists) {
    const lineItems = [
      { description: "Consultation Fee", quantity: 1, unitPrice: 500, amount: 500 },
    ];

    const subTotal = 500;
    const taxAmount = 0;
    const discountAmount = 0;
    const totalAmount = subTotal + taxAmount - discountAmount;
    const paidAmount = 0;
    const dueAmount = totalAmount;

    await BillingModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      appointmentId: appointment?._id,

      invoiceNumber,

      lineItems,

      subTotal,
      taxAmount,
      discountAmount,
      totalAmount,
      paidAmount,
      dueAmount,

      status: BillingStatus.ISSUED,
      issuedAt: new Date(),

      createdByHospitalAdminId: admin._id,
    });

    console.log("✅ Billing seeded");
  } else {
    console.log("ℹ️ Billing already exists");
  }

  await disconnectDB();
}

seedBilling()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
