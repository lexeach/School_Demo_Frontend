import { useEffect } from 'react';

export const useMobileKeyboardPrevention = () => {
  useEffect(() => {
    const preventKeyboardOnMobile = () => {
      // Find all react-select input elements
      const selectInputs = document.querySelectorAll('.react-select__input input');
      
      selectInputs.forEach((input: HTMLInputElement) => {
        // Set attributes to prevent keyboard
        input.setAttribute('inputmode', 'none');
        input.setAttribute('readonly', 'readonly');
        input.style.caretColor = 'transparent';
        
        // Add event listeners to prevent focus behavior that might trigger keyboard
        const preventKeyboard = (e: Event) => {
          e.preventDefault();
          input.blur();
          // Re-focus after a short delay to maintain select functionality
          setTimeout(() => {
            input.focus();
          }, 10);
        };
        
        input.addEventListener('focus', preventKeyboard);
        input.addEventListener('click', preventKeyboard);
        input.addEventListener('touchstart', preventKeyboard);
        
        // Clean up function
        return () => {
          input.removeEventListener('focus', preventKeyboard);
          input.removeEventListener('click', preventKeyboard);
          input.removeEventListener('touchstart', preventKeyboard);
        };
      });
    };

    // Run on mount and when DOM changes
    preventKeyboardOnMobile();
    
    // Use MutationObserver to handle dynamically added select elements
    const observer = new MutationObserver(() => {
      preventKeyboardOnMobile();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);
}; 