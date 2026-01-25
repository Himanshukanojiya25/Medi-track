import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import { HospitalOnboardingModel } from '../../src/models/super-admin/hospital-onboarding.model';
import { HospitalOnboardingStatus } from '../../src/constants/super-admin';

// 🔐 Mock auth
jest.mock('../../src/middlewares/auth/authenticate.middleware', () => {
  return {
    __esModule: true,
    default: (req: any, _res: any, next: any) => {
      req.user = {
        id: '507f1f77bcf86cd799439011',
        role: 'SUPER_ADMIN',
      };
      next();
    },
  };
});


describe('Super Admin Hospital Onboarding API', () => {
  const hospitalId = new mongoose.Types.ObjectId().toString();

  beforeEach(async () => {
    await HospitalOnboardingModel.deleteMany({});
    await HospitalOnboardingModel.create({
      hospitalId,
      status: HospitalOnboardingStatus.PENDING,
    });
  });

  it('POST /super-admin/hospitals/:id/approve', async () => {
    const res = await request(app)
      .post(`/api/v1/super-admin/hospitals/${hospitalId}/approve`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe(
      HospitalOnboardingStatus.APPROVED
    );
  });

  it('POST /super-admin/hospitals/:id/reject', async () => {
    const res = await request(app)
      .post(`/api/v1/super-admin/hospitals/${hospitalId}/reject`)
      .send({ reason: 'Invalid documents' })
      .expect(200);

    expect(res.body.data.status).toBe(
      HospitalOnboardingStatus.REJECTED
    );
  });
});
