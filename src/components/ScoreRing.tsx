import React from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 120,
  strokeWidth = 8,
  color = '#34d399',
  label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="score-ring relative inline-flex items-center justify-center filter drop-shadow-lg" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-white font-black text-contrast-shadow tracking-tight" style={{ fontSize: size * 0.24 }}>{score}%</span>
        {label && (
          <span style={{ fontSize: size * 0.11 }} className="text-white/80 font-bold mt-1 text-contrast-shadow">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default ScoreRing;
