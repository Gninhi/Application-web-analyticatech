"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AppContentDTO } from "@/types/content";

const ContentContext = createContext<AppContentDTO | null>(null);

export function ContentProvider({
  content,
  children,
}: {
  content: AppContentDTO;
  children: ReactNode;
}) {
  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

/** Hook d'accès universel aux données dynamiques du site. */
export function useAppContent(): AppContentDTO {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error("useAppContent doit être utilisé au sein d'un ContentProvider");
  }
  return ctx;
}

/** Hook optionnel d'accès aux données sans lever d'exception si hors provider (ex: _not-found). */
export function useAppContentOptional(): AppContentDTO | null {
  return useContext(ContentContext);
}
