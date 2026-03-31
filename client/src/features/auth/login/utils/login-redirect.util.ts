import { AuthUser } from '../../../../services/auth/auth.service';

export function getLoginRedirectPath(user: AuthUser): string {
  switch (user.role) {
    case 'PATIENT':
      return '/patient/dashboard';
    case 'DOCTOR':
      return '/doctor/dashboard';
    case 'HOSPITAL_ADMIN':
      return '/hospital-admin/dashboard';
    case 'SUPER_ADMIN':
      return '/super-admin/dashboard';
    default:
      return '/';
  }
}

export function getRoleFromQueryParam(roleParam: string | null): 'patient' | 'doctor' | 'hospital' {
  if (roleParam === 'doctor') return 'doctor';
  if (roleParam === 'hospital') return 'hospital';
  return 'patient';
}

export function getRoleIcon(role: 'patient' | 'doctor' | 'hospital') {
  switch (role) {
    case 'doctor':
      return '🩺';
    case 'hospital':
      return '🏥';
    default:
      return '👤';
  }
}

export function getRoleTitle(role: 'patient' | 'doctor' | 'hospital') {
  switch (role) {
    case 'doctor':
      return 'Doctor Sign In';
    case 'hospital':
      return 'Hospital Admin Sign In';
    default:
      return 'Patient Sign In';
  }
}

export function getRoleDescription(role: 'patient' | 'doctor' | 'hospital') {
  switch (role) {
    case 'doctor':
      return 'Access your patient list, appointments, and prescriptions';
    case 'hospital':
      return 'Manage hospital operations, staff, and appointments';
    default:
      return 'Book appointments, view medical records, and more';
  }
}