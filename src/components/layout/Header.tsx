import { useState } from 'react';
import { View } from '@/types';
import { PhotoIcon, GithubIcon } from '@/components/ui';
import { NavItem } from './NavItem';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  resetAll: () => void;
}

export function Header({ currentView, setCurrentView, resetAll }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: View) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={resetAll}>
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <PhotoIcon />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900">PhotoLabs</span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
          <NavItem view="home" label="首页" currentView={currentView} setCurrentView={setCurrentView} />
          <NavItem view="features" label="功能" currentView={currentView} setCurrentView={setCurrentView} />
          <NavItem view="about" label="关于" currentView={currentView} setCurrentView={setCurrentView} />
        </nav>

        <div className="flex items-center gap-4">
          {/* GitHub Icon - hidden on mobile */}
          <a href="#" className="hidden md:block text-zinc-400 hover:text-zinc-900 transition-colors">
            <GithubIcon />
          </a>
          {window.aistudio && (
            <button
              onClick={() => window.aistudio?.openSelectKey().then(() => {
                // API key changed, handle in parent
              })}
              className="hidden md:block text-xs bg-gray-100 hover:bg-gray-200 text-zinc-600 px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
            >
              更换 Key
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden p-2 text-zinc-600 hover:text-zinc-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute top-16 left-0 right-0 bg-white shadow-xl border-b border-gray-100 animate-fade-in">
            <nav className="flex flex-col p-4 space-y-1">
              <MobileNavItem
                view="home"
                label="首页"
                currentView={currentView}
                onClick={handleNavClick}
              />
              <MobileNavItem
                view="features"
                label="功能"
                currentView={currentView}
                onClick={handleNavClick}
              />
              <MobileNavItem
                view="about"
                label="关于"
                currentView={currentView}
                onClick={handleNavClick}
              />

              {/* Mobile-only items */}
              <div className="pt-2 border-t border-gray-100 mt-2">
                <a
                  href="#"
                  className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <GithubIcon />
                  <span>GitHub</span>
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

// Mobile nav item component
interface MobileNavItemProps {
  view: View;
  label: string;
  currentView: View;
  onClick: (view: View) => void;
}

function MobileNavItem({ view, label, currentView, onClick }: MobileNavItemProps) {
  const isActive = currentView === view;

  return (
    <button
      onClick={() => onClick(view)}
      className={`flex items-center px-4 py-3 rounded-lg text-left font-medium transition-colors ${
        isActive
          ? 'bg-indigo-50 text-indigo-600'
          : 'text-zinc-600 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}
