import { useState, useRef, useEffect } from 'react';

const DraggableProgressBar = ({ current, total, onUpdate }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [localValue, setLocalValue] = useState(current);
    const progressRef = useRef(null);
  
    useEffect(() => {
      setLocalValue(current);
    }, [current]);
  
    const calculateProgress = (clientX) => {
      const rect = progressRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const width = rect.width;
      const percentage = Math.min(Math.max(x / width, 0), 1);
      return Math.round(percentage * total);
    };
  
    const handleMouseDown = (e) => {
      setIsDragging(true);
      const newValue = calculateProgress(e.clientX);
      setLocalValue(newValue);
    };
  
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newValue = calculateProgress(e.clientX);
        setLocalValue(newValue);
      }
    };
  
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onUpdate(localValue);
      }
    };
  
    useEffect(() => {
      const handleGlobalMouseUp = () => {
        if (isDragging) {
          setIsDragging(false);
          onUpdate(localValue);
        }
      };
  
      const handleGlobalMouseMove = (e) => {
        if (isDragging) {
          const newValue = calculateProgress(e.clientX);
          setLocalValue(newValue);
        }
      };
  
      if (isDragging) {
        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);
      }
  
      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }, [isDragging, localValue, onUpdate, total]);
  
    return (
      <div className="space-y-2">
        <div 
          ref={progressRef}
          className="relative w-full bg-gray-700 rounded-full h-2 cursor-pointer group"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            className="absolute bg-purple-600 h-full rounded-full transition-all duration-100"
            style={{ width: `${(localValue / total) * 100}%` }}
          />
          
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-gray-800 border-2 border-purple-600 rounded-full transition-all
              ${isDragging ? 'scale-125' : 'scale-100 group-hover:scale-110'}
              cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
            style={{ left: `${(localValue / total) * 100}%` }}
          />
  
          <div className="absolute inset-0 rounded-full bg-red-500/10 opacity-0 group-hover:opacity-30 pointer-events-none" />
        </div>
  
        <div className="flex justify-between text-sm text-gray-400">
          <span>Episode {localValue}</span>
          <span>Total {total}</span>
        </div>
      </div>
    );
};

export default DraggableProgressBar