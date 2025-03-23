/**
 * WebOS TV compatibility polyfills and utilities
 */

// Add spatial navigation for remote controls
document.addEventListener('DOMContentLoaded', () => {
  // Set initial focus on a focusable element when the app loads
  setTimeout(() => {
    const firstFocusable = document.querySelector('button, [tabindex="0"], a, input, select, textarea');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }, 1000);
  
  // Handle key navigation - important for remote controls
  document.addEventListener('keydown', (e) => {
    // Handle TV remote navigation - e.g., directional keys
    switch (e.keyCode) {
      case 37: // Left arrow
        navigateFocus('left');
        break;
      case 38: // Up arrow
        navigateFocus('up');
        break;
      case 39: // Right arrow
        navigateFocus('right');
        break;
      case 40: // Down arrow
        navigateFocus('down');
        break;
      case 13: // Enter key
        if (document.activeElement && document.activeElement.click) {
          document.activeElement.click();
        }
        break;
      default:
        break;
    }
  });
});

// Simple spatial navigation helper
function navigateFocus(direction) {
  if (!document.activeElement) return;
  
  const current = document.activeElement;
  const focusables = Array.from(
    document.querySelectorAll('button, [tabindex="0"], a, input, select, textarea')
  ).filter(el => el.offsetWidth > 0 && el.offsetHeight > 0);
  
  if (focusables.length <= 1) return;
  
  const currentRect = current.getBoundingClientRect();
  let closest = null;
  let closestDistance = Infinity;
  
  focusables.forEach(element => {
    if (element === current) return;
    
    const rect = element.getBoundingClientRect();
    let dx = 0, dy = 0;
    
    switch (direction) {
      case 'left':
        if (rect.right <= currentRect.left) {
          dx = currentRect.left - rect.right;
          dy = Math.abs(rect.top + rect.height/2 - (currentRect.top + currentRect.height/2));
        } else {
          return;
        }
        break;
      case 'right':
        if (rect.left >= currentRect.right) {
          dx = rect.left - currentRect.right;
          dy = Math.abs(rect.top + rect.height/2 - (currentRect.top + currentRect.height/2));
        } else {
          return;
        }
        break;
      case 'up':
        if (rect.bottom <= currentRect.top) {
          dy = currentRect.top - rect.bottom;
          dx = Math.abs(rect.left + rect.width/2 - (currentRect.left + currentRect.width/2));
        } else {
          return;
        }
        break;
      case 'down':
        if (rect.top >= currentRect.bottom) {
          dy = rect.top - currentRect.bottom;
          dx = Math.abs(rect.left + rect.width/2 - (currentRect.left + currentRect.width/2));
        } else {
          return;
        }
        break;
    }
    
    // Weight vertical distance more in horizontal navigation and vice versa
    const distance = direction === 'left' || direction === 'right'
      ? dx + dy * 2
      : dy + dx * 2;
      
    if (distance < closestDistance) {
      closestDistance = distance;
      closest = element;
    }
  });
  
  if (closest) {
    closest.focus();
  }
}

// Detect WebOS environment
window.isWebOS = navigator.userAgent.indexOf('Web0S') > -1;

// Add WebOS-specific class to body for additional styling if needed
if (window.isWebOS) {
  document.body.classList.add('webos-tv');
}
