import { useState, useRef, useEffect } from 'react';
import DraggableProgressBar from './MovieDraggableProgressBar';
import {
  Plus,
  Minus,
  Plus as PlusIcon
} from 'lucide-react';

const EpisodeProgress = ({ current, total, onUpdate }) => {
  const [localCount, setLocalCount] = useState(current);

  useEffect(() => {
    setLocalCount(current);
  }, [current]);

  const handleUpdate = (newCount) => {
    const validCount = Math.max(0, Math.min(newCount, total));
    setLocalCount(validCount);
    onUpdate(validCount);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">Episodes</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleUpdate(localCount - 1)}
            className="p-1 rounded-full hover:bg-red-100 disabled:opacity-0 disabled:cursor-not-allowed"
            disabled={localCount <= 0}
          >
            <Minus className="w-4 h-4 text-gray-500" />
          </button>

          <span className="text-sm text-gray-400 font-medium min-w-[60px] text-center">
            {localCount} / {total}
          </span>

          <button
            onClick={() => handleUpdate(localCount + 1)}
            className="p-1 rounded-full hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={localCount >= total}
          >
            <Plus className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
      <DraggableProgressBar
        current={localCount}
        total={total}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default EpisodeProgress
