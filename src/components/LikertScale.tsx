import React from 'react';

interface LikertScaleProps {
  value: number;
  onChange: (value: number) => void;
  labels?: [string, string];
}

const LikertScale: React.FC<LikertScaleProps> = ({
  value,
  onChange,
  labels = ['完 全 不 符 合', '完 全 符 合'],
}) => {
  return (
    <div className="w-full mt-6">
      <div className="flex gap-4 justify-center">
        {[1, 2, 3, 4, 5].map(v => {
          const isSelected = v === value;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-extrabold transition-all duration-300 ${
                isSelected
                  ? 'bg-emerald-400 text-slate-900 shadow-[0_0_20px_rgba(52,211,153,0.6)] border-transparent scale-110'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40'
              }`}
            >
              {v}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between mt-6 px-2 text-xs font-bold text-white/50 tracking-[0.2em]">
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
      </div>
    </div>
  );
};

export default LikertScale;
