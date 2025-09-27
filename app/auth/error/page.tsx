import { ErrorForm } from "@/features/auth";

export default async function Page({ searchParams, }: {
    searchParams: Promise<{ error: string }>;
}) {
    const params = await searchParams;

    return <ErrorForm error={params?.error} />;
}