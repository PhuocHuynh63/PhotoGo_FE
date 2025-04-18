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

export const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
        return "Vừa xong"
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        return `${minutes} phút trước`
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        return `${hours} giờ trước`
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400)
        return `${days} ngày trước`
    } else {
        return DateMonthYear(dateString)
    }
}