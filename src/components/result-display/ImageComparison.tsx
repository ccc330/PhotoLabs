import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
}

export function ImageComparison({ beforeImage, afterImage }: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  }, []);

  const onMouseDown = () => setIsDragging(true);
  const onTouchStart = () => setIsDragging(true);

  const onMouseUp = () => setIsDragging(false);
  const onTouchEnd = () => setIsDragging(false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  // Global event listeners for dragging outside container
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };

    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, handleMove]);

  return (
    <div
      className="relative w-full max-w-2xl mx-auto h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-2xl border border-white/10 select-none cursor-ew-resize bg-black"
      ref={containerRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
    >
      {/* After Image (Background) */}
      <img 
        src={afterImage} 
        alt="Generated Art" 
        className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" 
      />

      {/* Before Image (Foreground - Clipped) */}
      <div 
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none border-r-2 border-white/50 bg-black/50"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={beforeImage} 
          alt="Original Upload" 
          className="absolute top-0 left-0 h-full max-w-none object-contain"
          // Calculate width to match container aspect ratio if needed, but object-contain usually handles it.
          // For perfect overlay, images must have same aspect ratio.
          style={{ width: containerRef.current?.offsetWidth || '100%' }}
        />
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_15px_rgba(0,0,0,0.5)] z-20 flex items-center justify-center"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-zinc-900">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" transform="rotate(90 12 12)" />
          </svg>
        </div>
      </div>
      
      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white border border-white/10 z-10 pointer-events-none">
        Original
      </div>
      <div className="absolute top-4 right-4 bg-indigo-600/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white border border-white/10 z-10 pointer-events-none">
        Gemini Art
      </div>
    </div>
  );
};
