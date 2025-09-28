export const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return null;

    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
        month: "short", // e.g., "Feb"
        day: "numeric",
        year: "numeric",
    }).format(date);
};
