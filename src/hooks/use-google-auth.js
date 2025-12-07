import { useEffect, useState } from "react";

export const useGoogleAuth = () => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Identity Services is loaded
    const checkGoogleLoaded = () => {
      if (window.google && window.google.accounts) {
        setIsGoogleLoaded(true);
        console.log("Google Identity Services loaded");
        return;
      }

      // If not loaded yet, check again after a short delay
      setTimeout(checkGoogleLoaded, 100);
    };

    checkGoogleLoaded();
  }, []);

  return { isGoogleLoaded };
};

export default useGoogleAuth;
