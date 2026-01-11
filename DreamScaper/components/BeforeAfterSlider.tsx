
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

  const getSrc = (img: string) => {
    if (!img) return '';
    // If it's base64 or a full URL, return it. Otherwise, assume local file in root.
    if (img.startsWith('data:') || img.startsWith('http') || img.startsWith('/')) return img;
    return `./${img}`;
  };

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setPosition(percent);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (isResizing) handleMove(e.clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isResizing && e.touches.length > 0) handleMove(e.touches[0].clientX);
    };
    const onUp = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
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
      className="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-3xl overflow-hidden cursor-col-resize select-none bg-slate-100 group shadow-2xl border border-white/20"
      onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
      onTouchStart={() => setIsResizing(true)}
    >
      {/* After Image (The "Bottom" layer) */}
      <img 
        src={getSrc(afterImage)} 
        alt="After"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        loading="eager"
      />

      {/* Before Image (The "Top" layer, width-clipped) */}
      <div 
        className="absolute inset-0 h-full pointer-events-none z-10 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img 
          src={getSrc(beforeImage)} 
          alt="Before"
          className="absolute inset-0 h-full object-cover pointer-events-none"
          style={{ width: containerRef.current?.clientWidth || '1000px' }}
          loading="eager"
        />
      </div>

      {/* The Split Line */}
      <div 
        className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.4)] pointer-events-none"
        style={{ left: `${position}%` }}
      >
        {/* Professional Grab Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center text-emerald-600 border-[5px] border-emerald-50/80 pointer-events-auto transition-all hover:scale-110 active:scale-90">
          <div className="flex items-center justify-center bg-emerald-600 text-white w-full h-full rounded-full transition-colors hover:bg-emerald-500 shadow-inner">
            <MoveHorizontal size={24} strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className={`absolute bottom-6 left-6 z-30 transition-opacity duration-300 pointer-events-none ${isResizing ? 'opacity-0' : 'opacity-100'}`}>
        <span className="bg-black/40 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border border-white/10 uppercase">
          Current Site
        </span>
      </div>
      <div className={`absolute bottom-6 right-6 z-30 transition-opacity duration-300 pointer-events-none ${isResizing ? 'opacity-0' : 'opacity-100'}`}>
        <span className="bg-emerald-600/70 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border border-white/10 uppercase">
          DreamScaped
        </span>
      </div>

      {/* Hint overlay */}
      {!isResizing && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full text-emerald-900 text-sm font-black shadow-2xl transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
             DRAG TO SEE THE FUTURE
          </div>
        </div>
      )}
    </div>
  );
};
