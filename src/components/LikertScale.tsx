import React from 'react';

interface LikertScaleProps {
  value: number;
  onChange: (value: number) => void;
  labels?: [string, string];
}

const LikertScale: React.FC<LikertScaleProps> = ({
  value,
  onChange,
  labels = ['1', '5'],
}) => {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        {[1, 2, 3, 4, 5].map(v => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-md)',
              border: v === value
                ? '2px solid var(--color-primary)'
                : '1px solid var(--color-border)',
              background: v === value
                ? 'rgba(99, 102, 241, 0.2)'
                : 'var(--color-bg-secondary)',
              color: v === value
                ? 'var(--color-primary-light)'
                : 'var(--color-text-secondary)',
              fontSize: '1.25rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {v}
          </button>
        ))}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '0.5rem',
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
        padding: '0 0.5rem',
      }}>
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
      </div>
    </div>
  );
};

export default LikertScale;
