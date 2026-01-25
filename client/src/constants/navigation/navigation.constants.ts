export type NavItem = {
  label: string;
  path: string;
  roles: Array<'SUPER_ADMIN' | 'DOCTOR' | 'PATIENT'>;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/super-admin',
    roles: ['SUPER_ADMIN'],
  },
  {
    label: 'Hospitals',
    path: '/super-admin/hospitals',
    roles: ['SUPER_ADMIN'],
  },
  {
    label: 'Doctors',
    path: '/super-admin/doctors',
    roles: ['SUPER_ADMIN'],
  },
  {
    label: 'Dashboard',
    path: '/doctor',
    roles: ['DOCTOR'],
  },
  {
    label: 'Appointments',
    path: '/doctor/appointments',
    roles: ['DOCTOR'],
  },
];
