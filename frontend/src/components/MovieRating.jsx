import { useState} from 'react';
import {
  Search,
  ChevronDown,
  Star,
  X,
  Plus as PlusIcon,
} from 'lucide-react';
export const Select = ({ icon: Icon, value, onChange, options }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-red-400">
            <Icon className="h-4 w-4" />
        </div>
        <select
            value={value}
            onChange={onChange}
            className="appearance-none w-full text-xs pl-10 pr-10 py-2 bg-gray-800 border border-red-800 rounded-lg text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
        >
            {options.map(({ value, label }) => (
                <option key={value} value={value} className="bg-gray-800">
                    {label}
                </option>
            ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-red-400">
            <ChevronDown className="h-4 w-4" />
        </div>
    </div>
);

export const SearchInput = ({ value, onChange, onClear }) => (
    <div className="relative flex-1 min-w-[240px]">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-red-400">
            <Search className="h-4 w-4" />
        </div>
        <input
            type="text"
            placeholder="Search titles..."
            value={value}
            onChange={onChange}
            className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-red-800 rounded-lg text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:text-gray-500"
        />
        {value && (
            <button
                onClick={onClear}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-red-400"
            >
                <X className="h-4 w-4" />
            </button>
        )}
    </div>
);

export const StatusBadge = ({ status }) => {
    const colors = {
        planning: 'bg-blue-900/50 text-blue-200 border-blue-800',
        in_progress: 'bg-yellow-900/100 text-yellow-200 border-yellow-800',
        completed: 'bg-green-900/100 text-green-200 border-green-800',
        on_hold: 'bg-orange-900/100 text-orange-200 border-orange-800',
        dropped: 'bg-red-900/100 text-red-200 border-red-800'
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[status]}`}>
            {status.replace('_', ' ').toUpperCase()}
        </span>
    );
};

export const RatingStars = ({ rating, onRatingChange }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex items-center gap-1">
            {[...Array(10)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => onRatingChange(i + 1)}
                    onMouseEnter={() => setHover(i + 1)}
                    onMouseLeave={() => setHover(0)}
                    className="focus:outline-none transform transition-transform hover:scale-110"
                >
                    <Star
                        className={`w-4 h-4 transition-colors duration-200 ${i < (hover || rating)
                                ? 'text-red-500 fill-red-500'
                                : 'text-red-700'
                            }`}
                    />
                </button>
            ))}
            <span className="ml-2 text-sm text-red-400">
                {rating > 0 ? `${rating}/10` : '0/10'}
            </span>
        </div>
    );
};