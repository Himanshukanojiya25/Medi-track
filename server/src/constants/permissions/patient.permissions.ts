export enum PatientPermissions {
  VIEW_SELF_PROFILE = 'patient:view:self_profile',
  UPDATE_SELF_PROFILE = 'patient:update:self_profile',

  VIEW_APPOINTMENTS = 'patient:view:appointments',
  CREATE_APPOINTMENT = 'patient:create:appointment',
  CANCEL_APPOINTMENT = 'patient:cancel:appointment',

  VIEW_PRESCRIPTIONS = 'patient:view:prescriptions',
  VIEW_BILLING = 'patient:view:billing',

  CHAT_WITH_DOCTOR = 'patient:chat:doctor',
}
