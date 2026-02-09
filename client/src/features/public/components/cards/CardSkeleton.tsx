// src/features/public/components/cards/CardSkeleton.tsx

export function CardSkeleton() {
  return (
    <div className="card-skeleton">
      <div className="skeleton-line title" />
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
    </div>
  );
}
