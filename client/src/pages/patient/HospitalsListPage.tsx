// client/src/pages/patient/HospitalsListPage.tsx

import { useEffect, useState } from "react";
import { patientPublicController } from "../../controllers/patient";
import { Hospital } from "../../services/patient";

const HospitalsListPage = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  useEffect(() => {
    patientPublicController.getHospitals().then(setHospitals);
  }, []);

  return (
    <div>
      <h2>Hospitals</h2>
      {hospitals.map((h) => (
        <div key={h.id}>
          <strong>{h.name}</strong> — {h.address}
        </div>
      ))}
    </div>
  );
};

export default HospitalsListPage;
