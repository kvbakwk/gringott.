"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function AuthTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="relative w-full h-full overflow-hidden">
            <div
                key={pathname}
                className="form-transition-container w-full h-full flex justify-center items-center"
            >
                {children}
            </div>

            <style jsx global>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.98) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .form-transition-container {
          animation: fadeInScale 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
        </div>
    );
}
