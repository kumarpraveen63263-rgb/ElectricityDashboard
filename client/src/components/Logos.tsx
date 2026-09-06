import React, { useState } from "react";

// Tamil Nadu Government Emblem (Gopuram Temple Seal)
export function GovEmblem({ className = "w-full h-full", src }: { className?: string; src?: string }) {
  const [imgError, setImgError] = useState(false);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt="Government of Tamil Nadu Emblem"
        className={className}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Government of Tamil Nadu Emblem"
    >
      {/* Golden Seal Outer Circle */}
      <circle cx="60" cy="60" r="56" fill="#091E3A" stroke="#D4AF37" strokeWidth="4" />
      <circle cx="60" cy="60" r="50" stroke="#DAA520" strokeWidth="1.5" strokeDasharray="4 2" />

      {/* Decorative Rays */}
      <g stroke="#D4AF37" strokeWidth="1.2" opacity="0.7">
        <line x1="60" y1="12" x2="60" y2="18" />
        <line x1="60" y1="102" x2="60" y2="108" />
        <line x1="12" y1="60" x2="18" y2="60" />
        <line x1="102" y1="60" x2="108" y2="60" />
        <line x1="26" y1="26" x2="30" y2="30" />
        <line x1="90" y1="90" x2="94" y2="94" />
        <line x1="26" y1="90" x2="30" y2="86" />
        <line x1="90" y1="26" x2="94" y2="30" />
      </g>

      {/* Srivilliputhur Gopuram (Temple Tower Silhouette) */}
      <g fill="#F59E0B">
        {/* Kalasam (Top Spire Finials) */}
        <polygon points="60,16 58,23 62,23" fill="#FBBF24" />
        <polygon points="53,20 52,24 54,24" fill="#FBBF24" />
        <polygon points="67,20 66,24 68,24" fill="#FBBF24" />

        {/* Tier 1 (Top) */}
        <polygon points="52,24 68,24 66,32 54,32" />
        {/* Tier 2 */}
        <polygon points="49,33 71,33 68,42 52,42" />
        {/* Tier 3 */}
        <polygon points="46,43 74,43 71,53 49,53" />
        {/* Tier 4 */}
        <polygon points="43,54 77,54 74,65 46,65" />
        {/* Tier 5 (Base) */}
        <polygon points="40,66 80,66 77,78 43,78" />

        {/* Gopuram Main Arch Entryway */}
        <path d="M 52,78 L 52,68 C 52,63 68,63 68,68 L 68,78 Z" fill="#091E3A" stroke="#FBBF24" strokeWidth="1" />
      </g>

      {/* Base Ribbon Accent */}
      <path d="M 28,82 Q 60,76 92,82 L 88,92 Q 60,86 32,92 Z" fill="#B91C1C" stroke="#D4AF37" strokeWidth="1" />

      {/* Center Star Accent */}
      <polygon points="60,86 61.5,89 65,89 62,91 63,94 60,92 57,94 58,91 55,89 58.5,89" fill="#FFF" />

      {/* Outer Border ring highlight */}
      <circle cx="60" cy="60" r="57.5" stroke="#FBBF24" strokeWidth="0.8" opacity="0.8" />
    </svg>
  );
}

// Tamil Nadu Electricity Board (TNEB) Logo (Power & Lightning Emblem)
export function TnebLogo({ className = "w-full h-full", src }: { className?: string; src?: string }) {
  const [imgError, setImgError] = useState(false);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt="Tamil Nadu Electricity Board Logo"
        className={className}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Tamil Nadu Electricity Board Logo"
    >
      {/* Outer Shield Container */}
      <rect x="10" y="10" width="100" height="100" rx="20" fill="#0F294A" stroke="#EAB308" strokeWidth="3.5" />
      <rect x="15" y="15" width="90" height="90" rx="15" stroke="#38BDF8" strokeWidth="1" opacity="0.4" />

      {/* Transformer Coils (Background Rings) */}
      <circle cx="45" cy="55" r="22" stroke="#38BDF8" strokeWidth="3" opacity="0.6" strokeDasharray="6 3" />
      <circle cx="75" cy="55" r="22" stroke="#38BDF8" strokeWidth="3" opacity="0.6" strokeDasharray="6 3" />

      {/* Central High Voltage Lightning Bolt */}
      <path
        d="M 68,18 L 38,60 L 58,60 L 44,102 L 82,52 L 62,52 L 78,18 Z"
        fill="url(#lightning_grad)"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.5))"
      />

      {/* Gold TNEB Text Pill at Base */}
      <rect x="25" y="90" width="70" height="18" rx="4" fill="#EAB308" stroke="#78350F" strokeWidth="1" />
      <text
        x="60"
        y="103"
        fill="#091E3A"
        fontSize="12"
        fontWeight="bold"
        fontFamily="sans-serif"
        textAnchor="middle"
        letterSpacing="1.5"
      >
        TNEB
      </text>

      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="lightning_grad" x1="38" y1="18" x2="82" y2="102" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FACC15" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#EF4444" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Transformer Diagnostic Core Orb Logo
export function TransformerCoreLogo({ className = "w-full h-full", src }: { className?: string; src?: string }) {
  const [imgError, setImgError] = useState(false);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt="Diagnostic Transformer Core"
        className={className}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Transformer Core Icon"
    >
      <circle cx="50" cy="50" r="45" fill="#0B192C" stroke="#38BDF8" strokeWidth="2" />
      <circle cx="50" cy="50" r="35" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="5 3" />

      {/* Core Windings */}
      <rect x="35" y="25" width="10" height="50" rx="3" fill="#3B82F6" stroke="#93C5FD" strokeWidth="1" />
      <rect x="55" y="25" width="10" height="50" rx="3" fill="#3B82F6" stroke="#93C5FD" strokeWidth="1" />

      {/* Magnetic Flux Loops */}
      <path d="M 40 25 C 40 15, 60 15, 60 25" stroke="#F59E0B" strokeWidth="2" fill="none" />
      <path d="M 40 75 C 40 85, 60 85, 60 75" stroke="#F59E0B" strokeWidth="2" fill="none" />

      {/* Central Spark */}
      <circle cx="50" cy="50" r="8" fill="#FACC15" />
    </svg>
  );
}
