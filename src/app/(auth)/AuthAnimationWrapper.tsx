"use client";

import { useRef, useState, ReactNode, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function AuthAnimationWrapper({ children }: { children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null);
  const outgoingRef = useRef<HTMLDivElement>(null);
  const incomingRef = useRef<HTMLDivElement>(null);
  
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useState(pathname);
  const [prevChildren, setPrevChildren] = useState<ReactNode>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const { contextSafe } = useGSAP({ scope: container });

  const startTransition = contextSafe((newChildren: ReactNode) => {
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        setPrevChildren(null);
        setPrevPath(pathname);
      }
    });

    // Ustawienie początkowe dla nowej treści (ukryta na dole)
    gsap.set(incomingRef.current, { y: 20, opacity: 0, filter: "blur(10px)" });

    // 1. Animacja WYJŚCIA starej treści (góra)
    tl.to(outgoingRef.current, {
      y: -20,
      opacity: 0,
      filter: "blur(10px)",
      duration: 0.3,
      ease: "power2.in",
    }, 0);

    // 2. Animacja WEJŚCIA nowej treści (środek)
    tl.to(incomingRef.current, {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.4,
      ease: "back.out(1.5)",
      delay: 0.1, // Mała przerwa dla lepszego efektu
    }, 0.15);
  });

  useLayoutEffect(() => {
    if (pathname !== prevPath) {
      // Zapisujemy stare dzieci, żeby móc je wyświetlić w "outgoing"
      // children to już nowa treść dostarczona przez Next.js
      startTransition(children);
    }
  }, [pathname]);

  // Trick: Aby mieć dostęp do STARYCH dzieci w momencie zmiany, 
  // musimy je przechwycić zanim znikną.
  useLayoutEffect(() => {
    if (pathname === prevPath) {
      setPrevChildren(children);
    }
  }, [children, pathname, prevPath]);

  return (
    <div ref={container} className="relative w-full h-full flex justify-center items-center overflow-hidden">
      {/* Kontener WYCHODZĄCY (stara strona) */}
      {isAnimating && prevChildren && (
        <div ref={outgoingRef} className="absolute inset-0 flex justify-center items-center will-change-transform">
          {prevChildren}
        </div>
      )}

      {/* Kontener WCHODZĄCY (nowa strona) */}
      <div 
        ref={incomingRef} 
        className={`${isAnimating ? 'absolute' : 'relative'} inset-0 flex justify-center items-center will-change-transform`}
      >
        {children}
      </div>
    </div>
  );
}
