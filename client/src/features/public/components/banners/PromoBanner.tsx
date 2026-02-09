// src/features/public/components/banners/PromoBanner.tsx

type PromoBannerProps = {
  title: string;
  description?: string;
  ctaLabel?: string;
  onClick?: () => void;
};

export function PromoBanner({
  title,
  description,
  ctaLabel,
  onClick,
}: PromoBannerProps) {
  return (
    <section className="promo-banner">
      <div className="promo-banner__content">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>

      {ctaLabel && onClick && (
        <button className="promo-banner__cta" onClick={onClick}>
          {ctaLabel}
        </button>
      )}
    </section>
  );
}
