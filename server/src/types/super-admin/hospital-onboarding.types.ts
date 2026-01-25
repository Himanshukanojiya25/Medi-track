import { HospitalOnboardingStatus } from '../../constants/super-admin';

export interface HospitalOnboardingAttrs {
  hospitalId: string;
  status: HospitalOnboardingStatus;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  suspendedBy?: string;
  suspendedAt?: Date;
}
