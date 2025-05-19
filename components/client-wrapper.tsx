"use client";

import { ReactNode } from "react";

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <style jsx global>{`
        /* You can add any global styled-jsx styles here */
      `}</style>
    </>
  );
}
