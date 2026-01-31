"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type DeviceContextType = {
  isMobile: boolean;
};

const DeviceContext = createContext<DeviceContextType>({
  isMobile: false, // Default fallback
});

export const DeviceProvider = ({ children }: { children: React.ReactNode }) => {
  // We start as null or a default to handle the "Hydration" gap
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // This runs ONCE on mount
    const checkIsMobile = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileOS = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);

      // Lock the value based on the screen width at the moment of loading
      setIsMobile(width < 768 || isMobileOS);
    };

    checkIsMobile();
    // No event listener added here, so it stays fixed!
  }, []);

  return (
    <DeviceContext.Provider value={{ isMobile }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => useContext(DeviceContext);