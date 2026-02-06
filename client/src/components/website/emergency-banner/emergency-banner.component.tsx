export function EmergencyBanner() {
  return (
    <div className="bg-red-600 text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <p className="font-medium">
          🚑 Emergency? Call your local emergency number immediately.
        </p>
        <span className="hidden sm:inline text-xs opacity-90">
          MediTrack does not replace emergency medical services
        </span>
      </div>
    </div>
  );
}
