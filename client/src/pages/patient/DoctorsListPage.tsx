// client/src/pages/patient/DoctorsListPage.tsx

import { useEffect, useState } from "react";
import { patientPublicController } from "../../controllers/patient";
import { Doctor } from "../../services/patient";

const DoctorsListPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    patientPublicController.getDoctors().then(setDoctors);
  }, []);

  return (
    <div>
      <h2>Doctors</h2>
      {doctors.map((doc) => (
        <div key={doc.id}>
          <strong>{doc.name}</strong> — {doc.specialization} (
          {doc.hospitalName})
        </div>
      ))}
    </div>
  );
};

export default DoctorsListPage;
