// Zoom Prevention Utility
// This script prevents zoom issues in production environments

(function() {
  'use strict';
  
  // Force zoom to 1 on load
  function forceZoomReset() {
    if (document.body) {
      document.body.style.zoom = '1';
      document.body.style.transform = 'scale(1)';
      document.body.style.webkitTransform = 'scale(1)';
      document.body.style.mozTransform = 'scale(1)';
      document.body.style.msTransform = 'scale(1)';
    }
    
    if (document.documentElement) {
      document.documentElement.style.zoom = '1';
      document.documentElement.style.transform = 'scale(1)';
      document.documentElement.style.webkitTransform = 'scale(1)';
      document.documentElement.style.mozTransform = 'scale(1)';
      document.documentElement.style.msTransform = 'scale(1)';
    }
  }
  
  // Prevent zoom via touch events
  function preventTouchZoom(e) {
    if (e.touches && e.touches.length > 1) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }
  
  // Prevent zoom via keyboard shortcuts
  function preventKeyboardZoom(e) {
    // Prevent Ctrl/Cmd + +, -, 0, scroll wheel zoom
    if ((e.ctrlKey || e.metaKey) && (
      e.keyCode === 61 ||    // +
      e.keyCode === 107 ||   // + (numpad)
      e.keyCode === 173 ||   // -
      e.keyCode === 109 ||   // - (numpad)
      e.keyCode === 48 ||    // 0
      e.keyCode === 187 ||   // = (same as +)
      e.keyCode === 189      // - (same as -)
    )) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }
  
  // Prevent zoom via mouse wheel
  function preventWheelZoom(e) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }
  
  // Set up viewport dimensions
  function enforceViewport() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, shrink-to-fit=no, viewport-fit=cover'
      );
    }
  }
  
  // Force CSS zoom reset on all elements
  function resetAllElementsZoom() {
    const allElements = document.querySelectorAll('*');
    allElements.forEach(function(element) {
      if (element.style) {
        element.style.zoom = '1';
        element.style.transform = element.style.transform ? 
          element.style.transform.replace(/scale\([^)]*\)/g, '') + ' scale(1)' : 
          'scale(1)';
        element.style.webkitTransform = element.style.webkitTransform ? 
          element.style.webkitTransform.replace(/scale\([^)]*\)/g, '') + ' scale(1)' : 
          'scale(1)';
      }
    });
  }
  
  // Monitor for dynamic zoom changes
  function monitorZoom() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
          setTimeout(forceZoomReset, 10);
        }
      });
    });
    
    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['style', 'class']
      });
    }
  }
  
  // Detect and fix zoom changes
  function detectZoomChanges() {
    let lastInnerWidth = window.innerWidth;
    let lastOuterWidth = window.outerWidth;
    
    function checkZoom() {
      const currentInnerWidth = window.innerWidth;
      const currentOuterWidth = window.outerWidth;
      
      // If significant change in viewport, reset zoom
      if (Math.abs(currentInnerWidth - lastInnerWidth) > 50 || 
          Math.abs(currentOuterWidth - lastOuterWidth) > 50) {
        forceZoomReset();
        resetAllElementsZoom();
        lastInnerWidth = currentInnerWidth;
        lastOuterWidth = currentOuterWidth;
      }
    }
    
    setInterval(checkZoom, 500);
  }
  
  // Initialize all prevention methods
  function initializeZoomPrevention() {
    // Force initial zoom reset
    forceZoomReset();
    
    // Enforce viewport
    enforceViewport();
    
    // Add event listeners
    document.addEventListener('touchstart', preventTouchZoom, { passive: false });
    document.addEventListener('touchmove', preventTouchZoom, { passive: false });
    document.addEventListener('gesturestart', function(e) { e.preventDefault(); }, { passive: false });
    document.addEventListener('gesturechange', function(e) { e.preventDefault(); }, { passive: false });
    document.addEventListener('gestureend', function(e) { e.preventDefault(); }, { passive: false });
    
    document.addEventListener('keydown', preventKeyboardZoom, { passive: false });
    document.addEventListener('wheel', preventWheelZoom, { passive: false });
    
    // Monitor for changes
    monitorZoom();
    
    // Detect zoom changes
    detectZoomChanges();
    
    // Periodic check
    setInterval(function() {
      forceZoomReset();
      resetAllElementsZoom();
    }, 1000);
  }
  
  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeZoomPrevention);
  } else {
    initializeZoomPrevention();
  }
  
  // Also run on window load
  window.addEventListener('load', initializeZoomPrevention);
  
  // Export for manual triggering if needed
  window.forceZoomReset = forceZoomReset;
  window.resetAllElementsZoom = resetAllElementsZoom;
  
})(); 