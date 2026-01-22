import { Screen } from "./Screen";

interface MainLayoutProps {
    topScreen: React.ReactNode;
    bottomScreen: React.ReactNode;
}

export function MainLayout({ topScreen, bottomScreen }: MainLayoutProps) {
    return (
        <div className="flex flex-col gap-8 w-full max-w-[400px] mx-auto p-4 shrink-0">
            <Screen className="rounded-t-md border-b-8">{topScreen}</Screen>
            <Screen className="rounded-b-md border-t-8">{bottomScreen}</Screen>
        </div>
    );
}
