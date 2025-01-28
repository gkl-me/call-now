import React from 'react';

export function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-6"></div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Finding a chat partner...
        </h2>
        <p className="text-gray-600">This won't take long!</p>
      </div>
    </div>
  );
}