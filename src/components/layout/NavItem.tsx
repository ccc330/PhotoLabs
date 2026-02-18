import { View } from '@/types';

interface NavItemProps {
  view: View;
  label: string;
  currentView: View;
  setCurrentView: (view: View) => void;
}

export function NavItem({ view, label, currentView, setCurrentView }: NavItemProps) {
  return (
    <span
      onClick={() => setCurrentView(view)}
      className={`cursor-pointer transition-colors ${
        currentView === view ? 'text-zinc-900 font-semibold' : 'hover:text-zinc-900'
      }`}
    >
      {label}
    </span>
  );
}
