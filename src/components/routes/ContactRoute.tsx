"use client";

import { ContactView } from "@/components/sections/ContactView";
import { SectionErrorBoundary } from "@/components/system/SectionErrorBoundary";

/** Route "/contact" — vue Contact protégée par Error Boundary. */
export function ContactRoute() {
  return (
    <SectionErrorBoundary sectionName="Contact & Diagnostic">
      <ContactView />
    </SectionErrorBoundary>
  );
}