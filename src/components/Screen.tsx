import { cn } from "@/lib/utils";

interface ScreenProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Screen({ children, className, ...props }: ScreenProps) {
    return (
        <div
            className={cn(
                "w-full aspect-[4/3] bg-ds-screen-bg border-4 border-ds-border relative overflow-hidden shadow-inner",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
