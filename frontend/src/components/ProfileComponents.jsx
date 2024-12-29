import { Flame } from 'lucide-react';

export const Input = ({ icon: Icon, ...props }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-red-400">
        <Icon className="h-4 w-4" />
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-red-700 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
      />
    </div>
  );
  
  export const Button = ({ children, isLoading, ...props }) => (
    <button
      {...props}
      className="w-full bg-red-800 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-red-600"
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
  
  export const Alert = ({ type, children }) => (
    <div
      className={`p-4 rounded-lg ${
        type === 'success' 
          ? 'bg-green-900/50 text-green-400 border border-green-700' 
          : 'bg-red-900/50 text-red-400 border border-red-700'
      }`}
    >
      {children}
    </div>
  );
  
  export const Card = ({ title, description, children }) => (
    <div className="bg-gray-900 rounded-xl shadow-lg border border-red-800">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-red-400 flex items-center gap-2">
          <Flame className="h-5 w-5" />
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-gray-400">{description}</p>
        )}
      </div>
      <div className="px-6 pb-6">{children}</div>
    </div>
);
