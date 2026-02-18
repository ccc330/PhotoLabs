import { PublicPortraitStyle } from '@/types';
import { StyleCard } from './StyleCard';

interface StyleGridProps {
  styles: PublicPortraitStyle[];
  selectedStyle: PublicPortraitStyle | null;
  onStyleSelect: (style: PublicPortraitStyle) => void;
}

export function StyleGrid({ styles, selectedStyle, onStyleSelect }: StyleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {styles.map((style) => (
        <StyleCard
          key={style.id}
          style={style}
          isSelected={selectedStyle?.id === style.id}
          onSelect={onStyleSelect}
        />
      ))}
    </div>
  );
}
