import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage }) => {
  const [position, setPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setPosition(percent);
  }, []);

  const handleMouseDown = () => setIsResizing(true);
  const handleTouchStart = () => setIsResizing(true);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isResizing) return;
      handleMove(e.clientX);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isResizing) return;
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    const onUp = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchend', onUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [isResizing, handleMove]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-square md:aspect-[16/10] rounded-2xl overflow-hidden cursor-col-resize select-none bg-slate-200 shadow-inner"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* After Image (The background) */}
      <img 
        src={afterImage} 
        alt="After transformation"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Before Image (The overlay with clipping) */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none transition-none"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img 
          src={beforeImage} 
          alt="Before transformation"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </div>

      {/* Slider Line */}
      <div 
        className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.3)] pointer-events-none"
        style={{ left: `${position}%` }}
      >
        {/* Handle Button */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-emerald-600 border-4 border-emerald-50 pointer-events-auto transition-transform hover:scale-110 active:scale-90">
          <MoveHorizontal size={24} strokeWidth={3} />
        </div>
      </div>

      {/* Dynamic Labels */}
      <div className={`absolute top-6 left-6 z-10 bg-black/50 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest transition-opacity duration-300 pointer-events-none ${isResizing ? 'opacity-0' : 'opacity-100'}`}>
        BEFORE
      </div>
      <div className={`absolute top-6 right-6 z-10 bg-emerald-600/70 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest transition-opacity duration-300 pointer-events-none ${isResizing ? 'opacity-0' : 'opacity-100'}`}>
        AFTER
      </div>
    </div>
  );
};
