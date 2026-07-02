import { useMemo } from 'react';
import { cn } from '@/lib/utils';

/**
 * Calculates a 0–4 strength score for a password.
 * @param {string} password
 * @returns {{ score: number, label: string, color: string }}
 */
function getStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const clamp = Math.min(score, 4);

  const levels = [
    { label: 'Too weak',  color: 'bg-destructive' },
    { label: 'Weak',      color: 'bg-orange-500'  },
    { label: 'Fair',      color: 'bg-amber-400'   },
    { label: 'Good',      color: 'bg-emerald-400' },
    { label: 'Strong',    color: 'bg-emerald-600' },
  ];

  return { score: clamp, ...levels[clamp] };
}

/**
 * PasswordStrengthBar — visual meter shown under a password field.
 * @param {{ password: string }} props
 */
export function PasswordStrengthBar({ password }) {
  const { score, label, color } = useMemo(() => getStrength(password ?? ''), [password]);

  if (!password) return null;

  return (
    <div className="space-y-1.5" aria-live="polite">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-300',
              i <= score ? color : 'bg-muted'
            )}
          />
        ))}
      </div>
      {label && (
        <p className="text-xs text-muted-foreground">
          Password strength: <span className="font-medium text-foreground">{label}</span>
        </p>
      )}
    </div>
  );
}
