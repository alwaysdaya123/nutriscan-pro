import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PortionSize } from '@/types/database';

type PortionSelectorProps = {
  value: PortionSize;
  onChange: (size: PortionSize) => void;
};

const portions: { value: PortionSize; label: string; description: string }[] = [
  { value: 'small', label: 'Small', description: '70% of standard' },
  { value: 'medium', label: 'Medium', description: 'Standard serving' },
  { value: 'large', label: 'Large', description: '140% of standard' },
];

export function PortionSelector({ value, onChange }: PortionSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Portion Size</p>
      <div className="flex gap-2">
        {portions.map((portion) => (
          <Button
            key={portion.value}
            type="button"
            variant={value === portion.value ? 'default' : 'outline'}
            className={cn(
              'flex-1 flex-col h-auto py-3 gap-1',
              value === portion.value && 'ring-2 ring-primary ring-offset-2'
            )}
            onClick={() => onChange(portion.value)}
          >
            <span className="font-semibold">{portion.label}</span>
            <span className="text-xs opacity-70">{portion.description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
