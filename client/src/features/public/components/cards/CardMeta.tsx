// src/features/public/components/cards/CardMeta.tsx

type CardMetaProps = {
  label: string;
  value: string;
};

export function CardMeta({ label, value }: CardMetaProps) {
  return (
    <div className="card-meta">
      <span className="card-meta__label">{label}</span>
      <span className="card-meta__value">{value}</span>
    </div>
  );
}
