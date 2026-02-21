import { RouteSegments } from "@app/utils/routes";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ authMode: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const mode = (await params).authMode;

    if (mode === RouteSegments.Login) {
        return { title: "portfel. | logowanie" };
    }
    if (mode === RouteSegments.Register) {
        return { title: "portfel. | rejestracja" };
    }
    return {};
}

export default async function AuthPage({ params }: PageProps) {
    const mode = (await params).authMode;

    if (mode !== RouteSegments.Login && mode !== RouteSegments.Register) {
        notFound();
    }

    // Content rendered in layout.tsx to persist state and animations
    return null;
}
