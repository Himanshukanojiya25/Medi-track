// src/features/public/components/banners/EmergencyBanner.tsx

type EmergencyBannerProps = {
  phoneNumber?: string;
};

export function EmergencyBanner({ phoneNumber }: EmergencyBannerProps) {
  return (
    <section className="emergency-banner" role="alert">
      <strong>Emergency?</strong>
      <span>Find hospitals with 24×7 emergency services near you.</span>

      {phoneNumber && (
        <a href={`tel:${phoneNumber}`} className="emergency-banner__cta">
          Call {phoneNumber}
        </a>
      )}
    </section>
  );
}
