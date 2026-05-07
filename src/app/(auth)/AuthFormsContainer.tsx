"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import LoginForm from "@components/forms/LoginForm";
import RegisterForm from "@components/forms/RegisterForm";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function AuthFormsContainer() {
  const { authMode } = useParams();
  const container = useRef<HTMLDivElement>(null);
  const loginRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);
  
  const isLogin = authMode === "logowanie";
  const [hasInitialized, setHasInitialized] = useState(false);

  useGSAP(() => {
    // 1. Ustawienie początkowe przy wejściu na stronę
    if (!hasInitialized) {
      gsap.set(loginRef.current, { opacity: isLogin ? 1 : 0, y: isLogin ? 0 : 20, pointerEvents: isLogin ? "auto" : "none" });
      gsap.set(registerRef.current, { opacity: isLogin ? 0 : 1, y: isLogin ? 20 : 0, pointerEvents: isLogin ? "none" : "auto" });
      setHasInitialized(true);
      return;
    }

    // 2. Animacja przełączania
    const tl = gsap.timeline();
    
    if (isLogin) {
      // Rejestracja ucieka w górę
      tl.to(registerRef.current, {
        y: -20,
        opacity: 0,
        filter: "blur(10px)",
        pointerEvents: "none",
        duration: 0.3,
        ease: "power2.in"
      }, 0);

      // Logowanie wjeżdża od dołu
      tl.fromTo(loginRef.current, 
        { y: 20, opacity: 0, filter: "blur(10px)", pointerEvents: "none" },
        { y: 0, opacity: 1, filter: "blur(0px)", pointerEvents: "auto", duration: 0.4, ease: "back.out(1.5)" }
      , 0.15);
    } else {
      // Logowanie ucieka w górę
      tl.to(loginRef.current, {
        y: -20,
        opacity: 0,
        filter: "blur(10px)",
        pointerEvents: "none",
        duration: 0.3,
        ease: "power2.in"
      }, 0);

      // Rejestracja wjeżdża od dołu
      tl.fromTo(registerRef.current, 
        { y: 20, opacity: 0, filter: "blur(10px)", pointerEvents: "none" },
        { y: 0, opacity: 1, filter: "blur(0px)", pointerEvents: "auto", duration: 0.4, ease: "back.out(1.5)" }
      , 0.15);
    }
  }, { dependencies: [authMode], scope: container });

  return (
    <div ref={container} className="relative w-full h-fit flex justify-center items-center">
      <div 
        ref={loginRef} 
        className="absolute w-full flex justify-center will-change-transform"
      >
        <LoginForm />
      </div>

      <div 
        ref={registerRef} 
        className="absolute w-full flex justify-center will-change-transform"
      >
        <RegisterForm />
      </div>
    </div>
  );
}
