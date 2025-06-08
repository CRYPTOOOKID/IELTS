import React, { useState } from 'react';

const RefreshTestButton = ({ 
  onRefreshTest, 
  isLoading = false, 
  testType = 'test',
  position = 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
  className = ''
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRefreshClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmRefresh = async () => {
    setShowConfirm(false);
    if (onRefreshTest) {
      await onRefreshTest();
    }
  };

  const handleCancelRefresh = () => {
    setShowConfirm(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      case 'bottom-right':
      default:
        return 'bottom-6 right-6';
    }
  };

  return (
    <>
      {/* Refresh Test Button */}
      <div className={`fixed ${getPositionClasses()} z-10 ${className}`}>
        <div className="relative group">
          <button
            onClick={handleRefreshClick}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-4 rounded-full shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-110 animate-pulse hover:animate-none"
            title="Get a new test"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span className="material-icons text-2xl">refresh</span>
            )}
          </button>
          
          {/* Enhanced Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 hidden group-hover:block">
            <div className="bg-gray-900 text-white text-sm px-5 py-4 rounded-xl shadow-2xl border border-white/20 whitespace-nowrap max-w-xs">
              <div className="font-bold mb-1 text-orange-400">Already taken this {testType}?</div>
              <div className="text-gray-300 mb-2">Click to get a fresh new {testType}!</div>
              <div className="text-xs text-yellow-300 font-medium">⚠️ Only click if you need a different {testType}</div>
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6 animate-bounce">
                <span className="material-icons text-white text-3xl">refresh</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Get a New {testType.charAt(0).toUpperCase() + testType.slice(1)}?</h3>
              <div className="text-white/80 mb-6 leading-relaxed space-y-2">
                <p className="font-medium">Are you sure you want to refresh and get a completely new {testType}?</p>
                <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3 text-yellow-100">
                  <p className="text-sm font-medium">⚠️ Warning:</p>
                  <p className="text-sm">Your current progress will be lost and cannot be recovered.</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleCancelRefresh}
                  className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRefresh}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    'Yes, Get New Test'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RefreshTestButton; 