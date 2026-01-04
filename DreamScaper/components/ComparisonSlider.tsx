
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MoveHorizontal } from 'lucide-react';

export const ComparisonSlider: React.FC<{ beforeImage: string, afterImage: string }> = ({ beforeImage, afterImage }) => {
  const [pos, setPos] = useState(50);
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const move = useCallback((clientX: number) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      setPos((x / rect.width) * 100);
    }
  }, []);

  useEffect(() => {
    const hMove = (e: MouseEvent) => drag && move(e.clientX);
    const hUp = () => setDrag(false);
    window.addEventListener('mousemove', hMove);
    window.addEventListener('mouseup', hUp);
    return () => { window.removeEventListener('mousemove', hMove); window.removeEventListener('mouseup', hUp); };
  }, [drag, move]);

  return (
    <div ref={ref} className="relative w-full aspect-square md:aspect-[4/3] rounded-xl overflow-hidden cursor-col-resize select-none" onMouseDown={() => setDrag(true)}>
      <img src={afterImage} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={beforeImage} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="absolute top-0 bottom-0 w-1 bg-white z-10" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-emerald-600">
          <MoveHorizontal size={24} />
        </div>
      </div>
    </div>
  );
};
