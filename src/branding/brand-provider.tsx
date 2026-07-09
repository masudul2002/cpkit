"use client";

import * as React from "react";
import { BRAND_CONFIG } from "./brand";

interface BrandContextType {
  config: typeof BRAND_CONFIG;
}

const BrandContext = React.createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  return (
    <BrandContext.Provider value={{ config: BRAND_CONFIG }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = React.useContext(BrandContext);
  if (!context) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return context;
}
