// client/src/services/patient/patient.types.ts

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospitalName: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
}
