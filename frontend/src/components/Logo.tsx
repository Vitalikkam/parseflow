export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="8" fill="#2563EB" />
      {/* Document sheet */}
      <path
        d="M10 8h8l5 5v11a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"
        fill="white"
        fillOpacity="0.15"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Fold */}
      <path
        d="M18 8v5h5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Data bars */}
      <rect x="12" y="16" width="8" height="1.5" rx="0.75" fill="white" />
      <rect x="12" y="19" width="6" height="1.5" rx="0.75" fill="white" fillOpacity="0.7" />
      <rect x="12" y="22" width="4" height="1.5" rx="0.75" fill="white" fillOpacity="0.4" />
    </svg>
  );
}