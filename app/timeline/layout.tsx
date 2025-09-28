import { SideNav } from "@/shared";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex flex-col min-h-screen w-full">
            <div className="flex flex-1 w-full overflow-hidden">
                <SideNav />
                <div className="flex-1 overflow-y-auto px-4 py-6">
                    <div className="w-full">
                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
}