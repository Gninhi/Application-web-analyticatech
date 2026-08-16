"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazySectionProps {
  /** Contenu à monter quand la section approche du viewport. */
  children: ReactNode;
  /** Marge d'anticipation autour du viewport (ex: "600px"). */
  rootMargin?: string;
  /** Hauteur minimale du placeholder pour limiter le CLS. */
  minHeight?: number;
  /** Placeholder personnalisé. */
  placeholder?: ReactNode;
}

/**
 * LazySection — diffère le montage (et donc le chargement + l'hydration)
 * d'une section jusqu'à ce qu'elle approche du viewport (IntersectionObserver).
 *
 * Les sections sous la ligne de flottaison n'ont plus besoin d'être parsées
 * ni hydratées au chargement initial : gain direct sur le Total Blocking Time.
 * Un placeholder de hauteur réservée évite le décalage de mise en page (CLS).
 */
export function LazySection({
  children,
  rootMargin = "600px",
  minHeight = 420,
  placeholder,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // Repli navigateurs très anciens : on monte la section directement.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} aria-hidden={!show}>
      {show ? children : (placeholder ?? <div className="w-full" style={{ minHeight }} aria-hidden />)}
    </div>
  );
}