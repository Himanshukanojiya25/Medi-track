const SPECIALITIES = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Dermatology",
  "Pediatrics",
];

export function SpecialityList() {
  return (
    <ul>
      {SPECIALITIES.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}
