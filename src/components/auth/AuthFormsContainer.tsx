"use client";

import { usePathname } from "next/navigation";
import LoginForm from "@components/forms/LoginForm";
import RegisterForm from "@components/forms/RegisterForm";
import { RouteSegments } from "@app/utils/routes";
import clsx from "clsx";

export default function AuthFormsContainer() {
    const pathname = usePathname();

    const isLogin = pathname === `/${RouteSegments.Login}`;
    const isRegister = pathname === `/${RouteSegments.Register}`;

    const commonClasses =
        "absolute flex justify-center w-full max-w-[540px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]";

    return (
        <div className="relative w-full h-full flex justify-center items-center">
            <div
                className={clsx(
                    commonClasses,
                    isLogin
                        ? "opacity-100 translate-y-0 pointer-events-auto z-10"
                        : "opacity-0 -translate-y-5 pointer-events-none z-0"
                )}
            >
                <LoginForm />
            </div>

            <div
                className={clsx(
                    commonClasses,
                    isRegister
                        ? "opacity-100 translate-y-0 pointer-events-auto z-10"
                        : "opacity-0 translate-y-5 pointer-events-none z-0"
                )}
            >
                <RegisterForm />
            </div>
        </div>
    );
}
