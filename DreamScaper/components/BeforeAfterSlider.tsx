import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MoveHorizontal, ImageOff } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage }) => {
  const [position, setPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [errors, setErrors] = useState<{before?: boolean, after?: boolean}>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the raw filename if it doesn't look like a URL
  const srcBefore = beforeImage.includes('/') || beforeImage.startsWith('data:') ? beforeImage : beforeImage;
  const srcAfter = afterImage.includes('/') || afterImage.startsWith('data:') ? afterImage : afterImage;

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setPosition(percent);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };
  
  const handleTouchStart = () => {
    setIsResizing(true);
  };

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

  const ImageError = ({ label }: { label: string }) => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
      <ImageOff size={48} className="mb-2 opacity-20" />
      <p className="text-sm font-bold">Could not load {label} image</p>
      <p className="text-[10px]">Verify file exists at root</p>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-square md:aspect-[16/10] rounded-2xl overflow-hidden cursor-col-resize select-none bg-slate-200 shadow-inner group"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* After Image */}
      {errors.after ? <ImageError label="AFTER" /> : (
        <img 
          src={srcAfter} 
          alt="After"
          loading="eager"
          onError={() => setErrors(prev => ({...prev, after: true}))}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      )}

      {/* Before Image with Clipping */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {errors.before ? <ImageError label="BEFORE" /> : (
          <img 
            src={srcBefore} 
            alt="Before"
            loading="eager"
            onError={() => setErrors(prev => ({...prev, before: true}))}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        )}
      </div>

      {/* Divider Line */}
      <div 
        className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.3)] pointer-events-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-emerald-600 border-4 border-emerald-50 pointer-events-auto transition-transform hover:scale-110 active:scale-95">
          <MoveHorizontal size={24} strokeWidth={3} />
        </div>
      </div>

      <div className={`absolute top-6 left-6 z-30 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-opacity pointer-events-none ${isResizing ? 'opacity-0' : 'opacity-100'}`}>
        BEFORE
      </div>
      <div className={`absolute top-6 right-6 z-30 bg-emerald-600/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-opacity pointer-events-none ${isResizing ? 'opacity-0' : 'opacity-100'}`}>
        AFTER
      </div>
    </div>
  );
};
