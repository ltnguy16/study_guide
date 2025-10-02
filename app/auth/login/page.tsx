import { LoginForm } from "@/features/auth";

export default function Page() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background text-foreground">
            <div className="w-full max-w-sm bg-dialog shadow-md rounded-md p-6">
                <LoginForm />
            </div>
        </div>
    );
}
