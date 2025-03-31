export const MonthYear = (date: any) => {
    const month = new Date(date).toLocaleString('default', { month: 'numeric' })
    const year = new Date(date).getFullYear();
    return `${month}/${year}`;
}

export const DateMonthYear = (date: any) => {
    const day = new Date(date).toLocaleString('default', { day: 'numeric' });
    const month = new Date(date).toLocaleString('default', { month: 'numeric' });
    const year = new Date(date).getFullYear();
    return `${day}/${month}/${year}`;
}

export const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${day} ${month} ${year} `;
};